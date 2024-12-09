import { Box, Grid, Skeleton, Typography, CardMedia, Button, Paper } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import {
  getIPAddress,
  RegisterLoginRequestBody,
  registerLoginUser,
  ValidateOTPRequestBody,
  VerifyLoginOtp,
} from '../../api/login';
import { useTimer } from '../../hooks/useTimer';
import { FetchOtp, browserName, eventTracker, logEvent, mobileSDKRedirect, setGAUserId } from '../../lib/helper';
import { RootStateType } from '../../store/reducers';
import {
  AuthState,
  UPDATE_LOGIN_SESSION_ID,
} from '../../store/types/login';
import { FormOTPInput } from '../forms/FormOTPInput';
import FormSubmitButton from '../forms/FormSubmitButton';
import { ResendOtp } from '../otpField';
import Header from '../../components/header/index';
import "@fontsource/inter";
import { AddNewNumberRequestBody, GenerateOTPRequestBody, addNewMobile, generateOTP } from '../../api/banks';


interface Values {
  otp: any;
}
declare global {
  interface Window {
    handleOTP: () => void;
  }
}


let initialValues: Values = { otp: ['', '', '', '', '', ''] };

const validationSchema = yup.object().shape({
  otp: yup.array(),
});


export default function ChangeOtp(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [resend, setResend] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState('');
  const [animate, setAnimate] = useState("verify");
  const [enableanimate, setEnableanimate] = useState(true);
  const [disable, setDisable] = useState(true);
  const { decrypt, sdkType } = useSelector<RootStateType, AuthState>(
    (state) => state.auth,
  );
  const [searchParams] = useSearchParams();
  const phoneNumber: string | null = (location.state as any)?.phoneNumber;
  const discoveredbank: any = (location.state as any)?.discoveredbank;
  const [loader, setLoader] = useState({
    status: true,
    info: 'We have partnered with CAMSfinserv, an RBI registered Account Aggregator for fetching your data, you will shortly receive an OTP from CAMSfinserv',
    subInfo: '',
    moreInfo: '',
  });

  const { timer, startTimer, stopTimer, resetTimer } = useTimer({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      FetchOtp();
    }, 1500);
    initialValues = { 'otp': ['', '', '', '', '', ''] }
    setTimeout(() => {
      setEnableanimate(false);
    }, 1000)
    eventTracker('RLending_BankStatementLinkAccountFlow', {
      action: 'otp_sheet_shown',
      screen: 'change_number_screen',
      bank_name: discoveredbank?.FIPName
    })
    return () => {
      stopTimer();
      clearInterval(intervalId);
    };
  }, []);


  const generateNewOTP = async (resetForm?: () => void) => {
    stopTimer();
    resetForm ? resetForm() : "";
    setMessage('');
    setHasError(false);
    resetTimer();
    let generateOTPBody: GenerateOTPRequestBody = {
      I_BROWSER: browserName,
      I_MOBILENUMBER: decrypt.mobile,
      I_SECONDARY_MOBILE_NUMBER: phoneNumber,
    };
    const VerifyOTPResponse = await generateOTP(generateOTPBody);
    if (VerifyOTPResponse.RESULT_CODE === '200') {
      setInterval(() => {
        FetchOtp();
      }, 1500);
      setTimeout(() => {
        setEnableanimate(false);
      }, 1000)
      initialValues = { 'otp': ['', '', '', '', '', ''] }
    }
  };



  // const focus = () => {
  //   let element:any = document.getElementById('middle');
  //   const elementRect = element?.getBoundingClientRect();
  //   const absoluteElementTop = elementRect.top + window.pageYOffset;
  //   const middle = absoluteElementTop - (window.innerHeight / 2);
  //   window.scrollTo(0, middle);
  // }
  const onSubmit = async (
    values: Values,
    { setSubmitting, resetForm }: FormikHelpers<Values>,
  ) => {
    eventTracker('RLending_BankStatementLinkAccountFlow', {
      action: 'OTP_submitted',
      screen: 'change_number_screen',
      bank_name: discoveredbank?.FIPName
    });
    logEvent({
      category: 'OTP Verification page',
      action: 'New Mobile No. Verification',
      label:
        'Unique Customer user_id/session id on entering OTP and clicking on Confirm button',
      value: 1,
    });
    try {
      if (values.otp.length === 6) {
        setDisable(false)
      }
      let addNewNumberRequestBody: AddNewNumberRequestBody = {
        I_BROWSER: browserName,
        I_MOBILENUMBER: decrypt.mobile,
        I_SECONDARY_MOBILE_NUMBER: phoneNumber,
        I_MOBOTP: (values.otp.toString()).replaceAll(",", ""),
        I_Flag: 'M',
      };
      const addMobileResponse = await addNewMobile(addNewNumberRequestBody);
      if (addMobileResponse.RESULT_CODE !== '200') {
        // eventTracker('LinkingBankAccountFlowAction', { action: 'new_mobile_otp_failed', reason: addMobileResponse.MESSAGE })
        eventTracker('RLending_BankStatementLinkAccountFlow', { action: 'incorrect_otp_submitted' });
        throw new Error('Incorrect OTP. Please enter correct OTP');
      } else {
        eventTracker('RLending_BankStatementLinkAccountFlow', { action: 'otp_verified' });
        setMessage('Verified Successfully');
        setIsVerified(true);
        setDisable(true)
        setSubmitting(false);
        navigate('/link-account', { state: { phoneNumber: phoneNumber } });
        //  eventTracker('LinkingBankAccountFlowAction', { action: 'new_mobile_otp_verified' })
      }
    } catch (e) {
      // setTimeout(()=>{resetForm()},1000)
      setDisable(true)
      setMessage('Incorrect OTP. Please enter correct OTP');
      setHasError(true);
      //do nothing
      setSubmitting(false);
    }
  };

  return (<>
    {enableanimate && (<Grid sx={{ height: '80vh', backgroundColor: '#272239', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#fff', textAlign: 'center', gap: '20px' }}>
      <Box
      >
        <CardMedia
          component="img"
          src="/images/otp_loader.gif"
          alt="icon"
          sx={{ width: '200px', height: '129px', }}
        />
      </Box>
      <Box className="positivity">
        <div className={`change dot ${animate == 'verify' ? 'flowin' : 'flowout'}`}>Verifying your number</div>
      </Box>
    </Grid>)}
    {!enableanimate && (
      <Grid
        item
        container
        component={'main'}
        sx={{
          backgroundColor: '#272239',
          // border:'solid green',
          //padding:'20px 0px'
        }}
      >
        <Header label="Enter OTP" />
        <Grid component={'section'} sx={{ width: '100%' }}>
          <Box
            sx={{
              padding: '0px 16px',
              overflowY: 'scroll',
              // height: 'calc(100vh - 190px)',
              '::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                borderRadius: '4px',
                marginBottom: '8px',
                paddingTop: '45px'
              }}
            >
              <CardMedia
                component="img"
                src="/images/mobile-OTP.svg"
                alt="icon"
                sx={{ maxHeight: '49px', width: '41px', display: 'inline' }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontSize: '24px',
                  fontWeight: 700,
                  fontFamily: "Inter",
                  marginBottom: '8px',
                  lineHeight: '32px'
                }}
              >
                Verify bank with OTP
              </Typography>
              <Typography
                sx={{
                  color: '#D5CDF2',
                  fontSize: 14,
                  fontWeight: 400,
                  fontFamily: "Inter",
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}
              >
                Enter the OTP sent by CAMS to your mobile number {' '}
                {/* <br /> */}
                <span className='span-style'>
                  +91<span className='hyphen-style'>0</span>
                  {phoneNumber ? 'XXXXX-' + phoneNumber.substr(5) : (
                    <span className='mobile_skeleton'>
                      <Skeleton
                        animation="wave"
                        sx={{
                          ml: 1,
                          display: "inline-block"
                        }}
                        width={100}
                      />
                    </span>
                  )}
                </span>
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              paddingTop: '100px', margin: '0px 16px',
              '@media screen and (max-width: 400px)': {
                height: '80vh',
              },
            }}
          >


            <Formik
              onSubmit={onSubmit}
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, resetForm }) => (
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <FormOTPInput
                    name="otp"
                    label="Confirm bank account"
                    event="RLending_BankStatementLinkAccountFlow"
                    isVerified={isVerified}
                    setMessage={setMessage}
                    message={message}
                    onFocus={focus}
                    hasError={hasError}
                    onSubmit={() => {
                      handleSubmit();
                    }}
                  />
                  <Box sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#272239',
                    },
                  }}className="positivity">
                    <Typography sx={{ color: '#D5CDF2', fontSize: '14px', fontWeight: '400', textAlign: 'left' }} className={`change ${resend == 'Resend' ? 'flowin' : 'flowout'}`}>OTP has been sent again</Typography>
                    <ResendOtp
                      counter={timer}
                      startTimer={startTimer}
                      onResendOtp={() => {
                        eventTracker('RLending_BankStatementLinkAccountFlow', { action: 'resend_otp_clicked' });
                        generateNewOTP(resetForm)
                      }}
                    />
                  </Box>
                  <Box sx={{
                    position: 'fixed',
                    left: '0',
                    padding: '16px',
                    bottom: '0',
                    width: '100%'
                  }}>
                    <Box sx={{ width: '100%' }}>
                      <FormSubmitButton disabled={disable} label="Submit" />
                    </Box>
                  </Box>
                </Box>
              )}
            </Formik>
          </Box>
          <Grid
            sx={{
              textAlign: 'center',
              backgroundColor: '#272239',
              padding: '0px 16px',
              width: '100%',
              bottom: '0px',
              position: 'fixed',
              paddingBottom: '16px',
              // '@media screen and (max-width: 600px)': {
              //   // position: 'relative',
              //   // paddingTop: '120px',
              // },
            }}
          >
            <Box
              sx={{
                width: '100%',
                margin: 'auto',
                paddingTop: '12px',
                position: 'relative',
                paddingBottom: '8px'
              }}
            >
              <Typography
                sx={{ lineHeight: '14px', fontSize: '10px', fontFamily: 'Inter', color: '#FFFFFF' }}>
                Powered by RBI regulated Account Aggregator
                <span className='icon_powerby'><CardMedia
                  component="img"
                  src="/images/poweredBy.svg"
                  alt="icon"
                  sx={{ maxHeight: '60px', width: 'unset', display: 'inline' }}
                /></span>
              </Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                margin: 'auto',
                // paddingBottom: '16px',
              }}
            >
              <FormSubmitButton label="Submit" disabled={disable} />
            </Box>
          </Grid>
        </Grid>
      </Grid>)}
  </>
  );
}

