import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Chip,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Theme,
  Typography,
  CardMedia,
  Divider,
  Skeleton,
  Drawer,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { makeStyles } from '@mui/styles';
import { Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import "@fontsource/inter";

import {
  addNewMobile,
  AddNewNumberRequestBody,
  generateOTP,
  GenerateOTPRequestBody,
  getMobileNumbers,
  GetMobilesRequestBody,
  GetMobilesResponseBody,
  MobileList,
  bankDetail,
  discoverBanksResponseBody,
} from '../../api/banks';
import { useTimer } from '../../hooks/useTimer';
import { browserName, eventTracker, logEvent } from '../../lib/helper';
import { RootStateType } from '../../store/reducers';
import { AuthState } from '../../store/types/login';
import { FormOTPInput } from '../forms/FormOTPInput';
import FormSubmitButton from '../forms/FormSubmitButton';
import { ResendOtp } from '../otpField';
import Header from '../header/index';
import { IMAGE_BASE_URL } from '../../api/urls';
import RedirectingModal from '../RedirectingModal';
import "@fontsource/inter";


export function MobileNumberContainer() {
  const location = useLocation();
  const [mobilesList, setMobilesList] = useState<GetMobilesResponseBody>();
  const { decrypt } = useSelector<RootStateType, AuthState>((state) => state.auth);
  const [newNumber, setNewNumber] = React.useState('');
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loader, setLoader] = useState({
    status: false,
    info: '',
    subInfo: '',
    moreInfo: '',
  });

  const discoveredbank: discoverBanksResponseBody = (location.state as any)?.choosedBank;

  const { timer, startTimer, stopTimer, resetTimer } = useTimer({});



  useEffect(() => {
    async function callApi(getMobilesRequestBody: GetMobilesRequestBody) {
      try {
        const mobilesResponse = await getMobileNumbers(getMobilesRequestBody);
        setMobilesList(mobilesResponse);
      } catch (err) {
        console.error(err);
      }
    }

    const requestBody: GetMobilesRequestBody = {
      I_MOBILENUMBER: decrypt.mobile,
      I_BROWSER: browserName,
    };

    callApi(requestBody);
  }, []);

  useEffect(()=>{
    if(newNumber.length == 1){
      eventTracker('RLending_BankStatementLinkAccountFlow', {
        action: 'mobile_number_entered',
        screen: 'change_number_screen',
        bank_name: discoveredbank?.FIPName
      })
    }
  },[newNumber])

  const generateNewOTP = async (resetForm?: () => void) => {
    stopTimer();
    resetForm ? resetForm() : "";
    setMessage('');
    setHasError(false);
    resetTimer();
    let generateOTPBody: GenerateOTPRequestBody = {
      I_BROWSER: browserName,
      I_MOBILENUMBER: decrypt.mobile,
      I_SECONDARY_MOBILE_NUMBER: newNumber,
    };
    const generateOTPResponse = await generateOTP(generateOTPBody);
    if (generateOTPResponse.RESULT_CODE === '200') {
      eventTracker('RLending_BankStatementLinkAccountFlow', {
        action: 'otp_sent',
        screen: 'change_number_screen',
        bank_name: discoveredbank?.FIPName
      })
     // navigate('/otp-verification', { state: { phoneNumber: newNumber, discoveredbank: discoveredbank } });
    }
  };


  const onContinue = (inputNumber: any) => {
    const isNewNumber = (mobilesList?.lst || []).every(
      (existing) => existing.MobileNumber !== inputNumber,
    );
    if (isNewNumber) {
      generateNewOTP()
      navigate('/otp-verification', { state: { phoneNumber: newNumber, discoveredbank: discoveredbank } });
    } else {
      navigate('/link-account', { state: { phoneNumber: inputNumber } });
    }
  };

  return (
    <>
      <Header label="Change Mobile No." />
      <Grid
        container
        sx={{
          width: '100%',
          margin: 0,
          backgroundColor: '#272239',
        }}
      >
        <Box sx={{
          width: '100%', padding: '32px 16px',
          '@media screen and (max-width: 300px)': {
            padding: '16px 16px',
          },
        }}>
          <Box

          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                // justifyContent: 'space-between',
              }}
            >
              <CardMedia
                component="img"
                src="/images/Bank.svg"
                // alt="linked"
                sx={{ width: '28px', height: '28px' }}
              />
              <Typography sx={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '20px',
                color: 'white',
                padding: '0px 8px'
              }} >
                {/* <CardMedia
                    component="img"
                    image={IMAGE_BASE_URL + discoveredbank.LOGO }
                    alt="linked"
                    sx={{ width: '28px', height: '28px' }}
                  /> */}
                {discoveredbank
                  ? discoveredbank?.FIPName
                  : decrypt?.fipname || decrypt?.fipid}
              </Typography>
            </Box>
            <Box sx={{ paddingTop: '16px' }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '28px',
                  color: 'white',
                  fontStyle: 'normal'
                }}
              >
                Enter mobile number registered with this bank
              </Typography>
            </Box>
            <Box sx={{ padding: '28px 0px 12px 4px', }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#EEEAFF',
                  fontStyle: 'normal'
                }}
              >
              You will receive an OTP to verify number
              </Typography>
            </Box>
            <Box
              sx={{
                // backgroundColor: 'white',
                // borderRadius: '30px',
                // border: '1px solid #ACA1D3'

                display: 'flex',
                position: 'relative',
                gap: '12px',
                width: '100%',
              }}
            >
              <TextField className='place-holder'
                type="text"
                value={newNumber}
                // placeholder="Enter new mobile number"
                // size="medium"
                // className='test'

                autoComplete='off'
                sx={{

                  width: '100%',
                  '@media screen and (max-width: 300px)': {
                    fontSize: '10px !important',
                  },
                  '& fieldset': { border: 'none' },
                  margin: '0px',


                }}
                onChange={(e) => {
                  const regex =
                    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
                  if (e.target.value === '') {
                    setNewNumber('');
                  } else {
                    if (regex.test(e.target.value)) {
                      setNewNumber(e.target.value);
                    }
                  }
                }}
                inputProps={{ inputMode: 'numeric', maxLength: 10, }}
                InputProps={{
                  className: 'textField-style',
                  startAdornment: (
                    <InputAdornment position="start" >
                      <Box sx={{ display: 'flex' }}>
                        <Typography
                          variant="body1"
                          sx={{
                            // width: '100%',
                            // fontWeight: 700,
                            // color: '#282E3D',
                            // fontSize: '16px',
                            // lineHeight: '24px',
                            // margin: 'auto',
                            // fontFamily: 'Inter',

                            display: 'inline-flex',
                            padding: '12px 16px',
                            alignItems: 'center',
                            borderRadius: '8px',
                            border: '1px solid var(--text-800, #776E94)',
                            color: 'var(--text-800, #776E94)',
                            fontFamily: 'Inter',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            lineHeight: '24px',
                            '@media screen and (max-width: 300px)': {
                              fontSize: '10px !important',

                            },
                          }}
                        >
                          +91
                        </Typography>
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          sx={{
                            // color: '1px solid #D5CDF2',
                            // width: '20%',
                            // height: '40px',
                            // // padding: '0px 10px 0px 0px',
                            // margin: '0px 17px 0px 5px'

                            // display: 'flex',
                            // width: '248px',
                            // padding: '12px 16px',
                            // alignItems: 'center',
                            // borderRadius: '8px',
                            // border: '2px solid var(--electric-voilet-300, #C5B0FF)',
                            // color: 'var(--text-white, #FFF)',
                            // fontFamily: 'Inter',
                            // fontSize: '16px',
                            // fontStyle: 'normal',
                            // fontWeight: '400',
                            // lineHeight: '24px',
                            margin: '0'
                          }}
                        />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              ></TextField>

              {/* {newNumber.length === 10 && (
                  <Box sx={{
                    position: 'absolute',
                    right: '16px',
                    top: '13px',
                  }}>
                    <CardMedia
                      component="img"
                      src="/images/tick mark.svg"
                      alt="icon"
                      sx={{
                        maxHeight: '20px',
                        width: '20px',
                        display: 'inline',
                        marginTop: 0.5,
                        marginLeft: 0.5,

                      }}
                    />
                  </Box>
                )} */}
            </Box>
            <Box
              sx={{
                // width: '100%',
                borderRadius: '12px',
                // marginTop: '40px',
                // backgroundColor: '#6637E4',
                margin: ' 48px 16px 0 16px',
              }}
            >
              <LoadingButton className='border-colord'
                sx={{
                  color: '#fff !important',
                  backgroundColor: '#6637E4',
                  width: '100%',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0px 120px',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  borderRadius: '12px',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '20px',
                  textTransform: 'none',
                  background: 'linear-gradient(#6637e4, #6637e4) padding- box, linear-gradient(to bottom, #ffffff33, #ffffff00) border-box',

              '&:hover': {
                backgroundColor: '#6637E4',
              boxShadow: 'none',
                    },
              '&:disabled': {
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                opacity: '0.5',
                background: '#6637E4',
                     },
                  }}
              variant="contained"
              onClick={() => {
                if (
                  newNumber.length < 10 ||
                  (mobilesList?.lst &&
                    mobilesList.lst.filter(function (number: MobileList) {
                      return number.MobileNumber === newNumber;
                    }).length > 0)
                ) {
                  logEvent({
                    category: 'Add More Account Popup',
                    action: 'Changed Mobile Number',
                    label:
                      'Unique Customer user_id/session id where customer enters different mobile number and clicks on Continue button',
                    value: 1,
                  });
                }
                eventTracker('RLending_BankStatementLinkAccountFlow', {
                  action: 'confirm_clicked',
                  screen: 'change_number_screen',
                  bank_name: discoveredbank?.FIPName
                })
                onContinue(newNumber);
              }}
              disabled={newNumber.length < 10}>
              Confirm
            </LoadingButton>
          </Box>
        </Box>
      </Box >
      <RedirectingModal info={loader.info} opened={loader.status} />
    </Grid >
    </>
  );
}
