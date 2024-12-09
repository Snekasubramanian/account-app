import {
  Box,
  Card,
  FormControlLabel,
  Grid,
  styled,
  Theme,
  Typography,
  CardMedia,
  Divider,
  Drawer,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { makeStyles } from '@mui/styles';
import { Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

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
} from '../../api/banks';
import {
  ACCOUNTSTOLINK,
  AlreadyLinkedAccountsList,
  AuthenticateToken,
  AuthenticateTokenRequestBody,
  ConsentArtefact,
  ConsentArtefactRequestBody,
  FIPDetailsList,
  FipNewDiscoverelist,
  IndBank,
  LinkAccountRequestBody,
  LinkBankAccount,
} from '../../api/banks';
import { useTimer } from '../../hooks/useTimer';
import { FetchOtp, browserName, eventTracker, logEvent } from '../../lib/helper';
import { RootStateType } from '../../store/reducers';
import { AuthState } from '../../store/types/login';
import { FormOTPInput } from '../forms/FormOTPInput';
import FormSubmitButton from '../forms/FormSubmitButton';
import { ResendOtp } from '../otpField';
import { closeAndRedirect } from '../../lib/helper';
import { ADD_AUTHENTICATED_BANK, BANK_LIST, DISCOVER_REPONSE } from '../../store/types/bankListType';
import RedirectingModal from '../RedirectingModal';
import "@fontsource/inter";
import { IMAGE_BASE_URL } from '../../api/urls';
import { wrap } from 'module';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Values {
  otp: any;
}
let initialValues: Values = { otp: ['', '', '', '', '', ''] };

const validationSchema = yup.object().shape({
  otp: yup.array(),
});


export type CheckedAccounts = (AlreadyLinkedAccountsList | IndBank) & {
  Logo?: string;
  LOGO?: string;
};

type Options = 'existing' | 'new';

export default function OtpDrawer({
  flag,
  setFlag,
  checkedBank,
  linkResponse,
  loaderFlag,
  setotpLoader,
  phoneNumber,
  RefNumber,
  selectedFIP,
  isVerified,
  setIsVerified,
  discoveredBank,
  errorCount,
  setErrorCount
}: {
  flag: boolean;
  setFlag: any;
  loaderFlag: any;
  setotpLoader :any;
  checkedBank: any;
  linkResponse: any;
  phoneNumber: any;
  RefNumber: any;
  selectedFIP: any;
  isVerified?: any;
  setIsVerified?: any;
  discoveredBank?: any,
  errorCount?: any,
  setErrorCount?: any
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otpDrawer, setOtpDrawer] = useState(false);
  const { decrypt } = useSelector<RootStateType, AuthState>((state) => state.auth);
  const [newNumber, setNewNumber] = React.useState(phoneNumber);
  const [resend, setResend] = useState("");
  const [Verifyloader, setVerifyloader] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const { addNumberFlow } = useSelector<RootStateType, AuthState>((state) => state.auth);
  let intervalId :any;
  const { timer, startTimer, stopTimer, resetTimer } = useTimer({});
  const [disable, setDisable] = useState(true);

  const [linkresponse, setLinkresponse] = useState(linkResponse);
  const [Refnumber, setRefnumber] = useState(RefNumber);
  const [loadingProgress, setLoadingProgress] = useState(false);
  //console.log("checkedBank",checkedBank)
  //console.log("loader",loader)

  useEffect(() => {
    initialValues = { 'otp': ['', '', '', '', '', ''] }
    if (flag) {
      eventTracker('RLending_BankStatementSecondOtpScreen', { action: 'verify_otp_sheet_launched' });
    }
    return () => {
      stopTimer();
      resetTimer();
      clearInterval(intervalId);
    };
  }, [flag]);

  useEffect(() => {
    if (errorCount === 5) {
      setFlag(false)
    }
  }, [errorCount]);

  const generateNewOTP = async () => {
    stopTimer();
    setHasError(false);
    let generateOTPBody: GenerateOTPRequestBody = {
      I_BROWSER: browserName,
      I_MOBILENUMBER: decrypt.mobile,
      I_SECONDARY_MOBILE_NUMBER: newNumber,
    };
    // eventTracker('LinkingBankAccountOtpFlowAction', { action: 'resend_otp_clicked' });
    const generateOTPResponse = await generateOTP(generateOTPBody);
    if (generateOTPResponse.RESULT_CODE === '200') {
      initialValues = { 'otp': ['', '', '', '', '', ''] }
      setOtpDrawer(true);
      resetTimer();
    }
  };

  const onResend = (resetForm: () => void) => {
    resetForm();
    setMessage('');
    try {
      initialValues = { 'otp': ['', '', '', '', '', ''] }
      setResend("Resend");
      callLinkAPI();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const callLinkAPI = async () => {
    stopTimer();
    // setLoader();
    resetTimer();
    setTimeout(() => {
      setResend("");
    }, 3000)
    let ACCOUNTS_TO_LINK: ACCOUNTSTOLINK[] = [];
    checkedBank.forEach((bank: any) => {
      ACCOUNTS_TO_LINK.push({
        FIPACCNUM: bank.FIPACCNUM,
        FIPACCREFNUM: bank.FIPACCREFNUM,
        FIPACCTYPE: bank.FIPACCTYPE,
        FIPTYPE: bank.FITYPE,
        FIPID: bank.FIPID,
        Logo: bank.Logo,
      });
    });
    const handleBody: LinkAccountRequestBody = {
      I_MOBILENUMBER: phoneNumber,
      I_BROWSER: browserName,
      I_FIPID: checkedBank[0].FIPID,
      ACCOUNTS_TO_LINK: ACCOUNTS_TO_LINK,
    };
    const linkResponse = await LinkBankAccount(handleBody);
    if (linkResponse.RESULT_CODE === '200') {
      eventTracker('RLending_BankStatementSecondOtpScreen', {
        action: 'otp_sent'
      })
      intervalId = setInterval(() => {
        FetchOtp();
      }, 1500);
      setLinkresponse(linkResponse);
      setRefnumber(linkResponse.RefNumber);
      // resetTimer();
    }
    // setLoader({ ...loader, status: false });
  };

  const onSubmit = async (
    values: Values,
    { setSubmitting, resetForm }: FormikHelpers<Values>,
  ) => {
    setLoader(false)
    // eventTracker('LinkingBankAccountOtpFlowAction', { action: 'otp_submitted', auto_submitted: true });
    eventTracker('RLending_BankStatementSecondOtpScreen', {
      action: 'otp_submitted'
    })
    console.log("checkedBank[0].FIPID", checkedBank[0].FIPID)
    // setLoader({ ...loader, status: true, info: 'Validating OTP' });
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
      setVerifyloader(true);
      const authenticateBody: AuthenticateTokenRequestBody = {
        I_MOBILENUMBER: phoneNumber,
        I_BROWSER: browserName,
        I_FIPID: checkedBank[0].FIPID,
        I_FIPACCREFNUM: RefNumber,
        I_MOBOTP: (values.otp.toString()).replaceAll(",", ""),
      };

      const authenticateResponse = await AuthenticateToken(authenticateBody);
      // console.log('oooootp',authenticateResponse)
      // To differentiate already linked accounts from recently OTP verified accounts

      if (authenticateResponse.RESULT_CODE === '200') {
        //  eventTracker('LinkingBankAccountOtpFlowAction', { action: 'otp_verification_successful' });
        const filteredAccounts = checkedBank.filter((bank: any) =>
          authenticateResponse.fip_NewDiscoverelist.every(
            (acc) => acc.FIPACCREFNUM !== bank.FIPACCREFNUM,
          ),
        );
        let discover= authenticateResponse.fip_NewDiscoverelist.map((acc:any)=> (acc = {...acc,Linked:true}));
        dispatch({
          type: DISCOVER_REPONSE,
          body: discover,
        });
        dispatch({
          type: BANK_LIST,
          body: discover,
        });
        dispatch({
          type: ADD_AUTHENTICATED_BANK,
          body: [...authenticateResponse.fip_NewDiscoverelist, ...filteredAccounts],
        });
        setVerifyloader(false);
        setIsVerified(true);
        setDisable(true)
        setLoader(true);
        setMessage('Verified Successfully');
        eventTracker('RLending_BankStatementSecondOtpScreen', {
          action: 'otp_verified'
        })
        setTimeout(() => {
          navigate("/Confirm")
          setFlag(false)
          setLoader(false)
          setIsVerified(false)
          setMessage('')
        }, 2000)

        if (addNumberFlow) {
          if (decrypt.mobile === phoneNumber) {
            logEvent({
              category: 'OTP Verification by FIP page',
              action: 'Linking & Submit Consent ',
              label:
                'Unique Customer user_id/session id on entering OTP and clicking on Confirm button',
              value: 1,
            });
          }
          setTimeout(() => {
            setFlag(false)
            setLoader(false)
            setIsVerified(false)
            setMessage('')
          }, 2000)
          return;
        } else {
          logEvent({
            category: 'OTP Verification page',
            action: 'FIP Verification & Consent Submission',
            label:
              'Unique Customers/Sessions where customer enters 6-digits otp and clicks on Submit Consent button. ',
            value: 1,
          });
          const consent = await provideConsent(authenticateResponse.fip_NewDiscoverelist);

          if (consent) {
            closeAndRedirect({
              url: decrypt?.redirect,
              parentStatusMessage: 'ACCEPTED',
              decrypt,
            });
          }
        }
      } else {
        if (addNumberFlow) {
          if (decrypt.mobile === phoneNumber) {
            logEvent({
              category: 'OTP Verification by FIP page',
              action: 'Linking & Submit Consent ',
              label:
                'Unique Customer user_id/session id on entering OTP and clicking on Confirm button',
              value: 0,
            });
          } else {
            logEvent({
              category: 'OTP Verification page',
              action: 'FIP Verification & Consent Submission',
              label:
                'Unique Customers/Sessions where customer enters 6-digits otp and clicks on Submit Consent button. ',
              value: 0,
            });
          }
        }
        // setTimeout(()=>{resetForm()},1000)
        setErrorCount((prev: any) => prev + 1)
        setHasError(true);
        setDisable(true)
        setotpLoader(false)
        setLoader(false)
        setVerifyloader(false);
        setIsVerified(false)
        setMessage('Incorrect OTP. Please enter correct OTP');
        // eventTracker('LinkingBankAccountOtpFlowAction', { action: 'otp_verification_failed', reason: authenticateResponse.MESSAGE });
        eventTracker('RLending_BankStatementSecondOtpScreen', {
          action: 'incorrect_otp_submitted'
        })
      }
    } catch (e) {
      setLoader(false);
      // setSubmitting(false);
    }
  };

  const focus = () => {
    console.log("focused")
  }

  const provideConsent = async (authenticatedBanks: FipNewDiscoverelist[]) => {
    try {
      let FIPDetailsList: FIPDetailsList[] = [];

      checkedBank.forEach((bank: any) => {
        const isAlreadyLinked = !!bank.LINKEDDATE;
        const fipName = bank?.FIPNAME || '';
        const linkRefNumber = isAlreadyLinked
          ? bank.FIPACCLINKREF
          : authenticatedBanks.find((acc) => acc.FIPACCREFNUM === bank.FIPACCREFNUM)
            ?.FIPACCLINKREF;

        FIPDetailsList.push({
          CUSTID: phoneNumber,
          FIPID: bank.FIPID,
          FIPACCREFNUM: bank.FIPACCREFNUM,
          LINKINGREFNUM: linkRefNumber || '',
          LINKEDDATE: bank.LINKEDDATE,
          FIPACCTYPE: bank.FIPACCTYPE,
          FIPACCNUM: bank.FIPACCNUM,
          FITYPE: bank.FITYPE,
          CONSENTCOUNT: checkedBank.length,
          CONSENTDATE: new Date(),
          LOGO: bank?.Logo || bank?.LOGO || '',
          FIPNAME: fipName,
          FIPACCLINKREF: linkRefNumber || '',
          isCardSelected: true,
        });
      });

      const consentBody: ConsentArtefactRequestBody = {
        I_MOBILENUMBER: phoneNumber,
        I_MPIN: '111111',
        I_BROWSER: browserName,
        I_ConsentHandle: decrypt?.srcref,
        FIPDetailsList: FIPDetailsList,
      };
      const consentResponse = await ConsentArtefact(consentBody);
      return consentResponse.RESULT_CODE === '200';
    } catch {
      return false;
    }
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={flag}
        sx={{
          zIndex: (theme: any) => theme.zIndex.modal + 1,
          '& .MuiDrawer-paper': {
            bgcolor: 'transparent'
          }
        }}
        onClose={() => setFlag(false)}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '30.5em',
            backgroundColor: '#272239',
            borderRadius: '20px 20px 0 0',
          }}
        >
          <Box sx={{ padding: '0px 16px' }}>
            {loaderFlag ? <Box
              sx={{
                width: '100%',
                //  margin:'auto',
                display: 'flex',
                alignItems: 'center',
                justifyItems: 'center',
                flexDirection: 'column',
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                msTransform: 'translate(-50%, -50%)',
              }}>
              <div className='loader'></div>
            </Box> : <></>}
            {!loader && !loaderFlag && !Verifyloader ? <Box>
              <Box sx={{ position: 'absolute', top: '16px', right: '16px', cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  src="/images/big cross.svg"
                  alt="icon"
                  sx={{ maxHeight: '24px', width: '24px', display: 'inline' }}
                  onClick={() => {
                    eventTracker('RLending_BankStatementSecondOtpScreen', {
                      action: 'otp_sheet_cross_clicked'
                    })
                    setFlag(false)
                  }}
                />
              </Box>
              <Box
                sx={{
                  paddingTop: '48px',
                  borderRadius: '4px'
                }}
              >
                <CardMedia
                  component="img"
                  src="/images/mobile-OTP.svg"
                  alt="icon"
                  sx={{ maxHeight: '49px', width: '41px', display: 'inline' }}
                />
              </Box>
              <Box
                sx={{
                  // width: '100%',
                  // height: '80px',
                  paddingTop: '8px'
                }}
              >
                <Box  >
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 700,
                      fontSize: '20px',
                      lineHeight: '28px',
                      color: 'white',
                    }}
                  >
                    Verify OTP
                  </Typography>
                </Box>
                <Box sx={{ paddingTop: '8px', }}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '21px',
                      color: '#D5CDF2',
                      // display: 'flex',
                      // flexWrap: 'wrap',
                      // alignItems: 'center',
                      // '@media screen and (min-width: 300px)': {
                      //    display:'flex',
                      // flexWrap:'wrap',
                      // alignItems:'center',
                      // }

                    }}
                  >
                    Enter the OTP sent by your bank to

                    <span className='span-style'>
                      +91XXXXX-{newNumber.substring(5)}
                    </span>
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: '16px',
                }}
              >
                {checkedBank ?
                  //    <CardMedia
                  //    component="img"
                  //    src={IMAGE_BASE_URL + checkedBank[0].Logo}
                  //    sx={{ maxWidth: '28px', height: '28px',borderRadius:'50%' }}
                  //  /> 
                  <img
                    style={{
                      width: '28px',
                      height: '28px',
                      // objectFit: 'contain',
                      // margin: 'auto',
                      // borderRadius: '1em',
                      borderRadius: '50%'
                    }}
                    src={IMAGE_BASE_URL + checkedBank[0]?.Logo}
                  />
                  :
                  <CardMedia
                    component="img"
                    src="/images/Bank.svg"
                    sx={{ width: '28px', height: '28px' }}
                  />
                }
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '20px',
                    color: 'white',
                    display: "flex",
                    padding: '0px 8px'
                  }}>

                  {discoveredBank ?
                    discoveredBank.FIPName
                    : decrypt?.fipname || decrypt?.fipid}
                </Typography>
              </Box>
              <Box sx={{ paddingTop: '64px' }}>
                <Formik
                  onSubmit={onSubmit}
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={validationSchema}
                >
                  {({ handleSubmit, resetForm }) => (
                    <Box component="form" noValidate onSubmit={handleSubmit}>
                      <FormOTPInput
                        name="otp"
                        label="Confirm bank account"
                        event="RLending_BankStatementSecondOtpScreen"
                        isVerified={isVerified}
                        setMessage={setMessage}
                        message={message}
                        onFocus={focus}
                        hasError={hasError}
                        inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                        onSubmit={() => {
                          handleSubmit();
                        }}
                      />
                      <Box className="positivity">
                        <Typography sx={{ color: '#D5CDF2', fontSize: '14px', fontWeight: '400', textAlign: 'left' }} className={`change ${resend == 'Resend' ? 'flowin' : 'flowout'}`}>OTP has been sent again</Typography>
                        <ResendOtp
                          counter={timer}
                          startTimer={startTimer}
                          onResendOtp={() => {
                            eventTracker('RLending_BankStatementSecondOtpScreen', {
                              action: 'resend_otp_clicked'
                            })
                            onResend(resetForm)
                          }}
                        />
                      </Box>
                      <Box sx={{
                        position: 'fixed',
                        left: '0',
                        padding: '16px',
                        bottom: '0',
                        width: '100%',
                        background: '#272239'

                      }}>
                        <Box sx={{ width: '100%', }}>
                          <FormSubmitButton disabled={disable} label="Submit" />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Formik>
              </Box>
            </Box> :
              <></>}
            {loader ? <Box
              sx={{
                width: '100%',
                //  margin:'auto',
                display: 'flex',
                // alignItems:'center',
                flexDirection: 'column',
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                msTransform: 'translate(-50%, -50%)',
              }}>
              <CardMedia
                component="img"
                src="images/otpVerify.gif"
                alt="icon"
                sx={{ height: '64px', width: '64px', borderRadius: '50%', margin: 'auto' }}
              //onClick={() => setOtpDrawer(false)}
              />
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '28px',
                  color: '#fff',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >
                OTP Verified
              </Typography>
            </Box> : <></>}

            {Verifyloader ? <Box
              sx={{
                width: '100%',
                //  margin:'auto',
                display: 'flex',
                // alignItems:'center',
                flexDirection: 'column',
                margin: 0,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                msTransform: 'translate(-50%, -50%)',
              }}>
              <CardMedia
                component="img"
                src="images/otp_loader.gif"
                alt="icon"
                sx={{ width: '200.464px', margin: 'auto' }}
              //onClick={() => setOtpDrawer(false)}
              />
              <Typography className='dot'
                sx={{
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: '#fff',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >
                Verifying OTP
              </Typography>
            </Box> : <></>}

          </Box>
        </Box>
        {/* <RedirectingModal
          info={loader.info}
          opened={loader.status}
          LoadingProgress={loadingProgress}
        /> */}
      </Drawer>
    </>
  );
}


