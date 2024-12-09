import { Box, Grid, Skeleton, Typography, CardMedia, Button, Paper } from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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


export default function VerifyUser(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [resend, setResend] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState();
  const [disable, setDisable] = useState(true);
  const { decrypt, sdkType } = useSelector<RootStateType, AuthState>(
    (state) => state.auth,
  );
  const [searchParams] = useSearchParams();
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
    eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'verify_otp_screen_launched' });
    return () => {
      stopTimer();
      clearInterval(intervalId);
    };
  }, []);


  const callRegisterLoginAPI = async (xorDecryptData: any) => {
    stopTimer();
    const decryptRes = xorDecryptData ?? decrypt;
    const I_CLIENTIP = await getIPAddress();
    const registerLoginBody: RegisterLoginRequestBody = {
      I_MOBILENUMBER: decryptRes?.mobile,
      I_CLIENTIP,
      I_BROWSER: browserName,
      I_MPIN: '123456',
    };
    resetTimer();
    setTimeout(() => {
      setResend("");
    }, 3000)
    const registerResponse = await registerLoginUser(registerLoginBody);
    if (registerResponse?.RESULT_CODE === '200') {
      eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'otp_sent' });
    }
    setLoader({ ...loader, status: false });
  };

  const onResend = async (resetForm: () => void) => {
    initialValues = { 'otp': ['', '', '', '', '', ''] };
    setMessage('');
    try {
      setResend("Resend");
      callRegisterLoginAPI(decrypt);
      eventTracker('RLending_BankStatementFirstOTPScreen', { action: 'resend_otp_clicked' });
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const focus = () => {
    let element: any = document.getElementById('middle');
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 2);
    window.scrollTo(0, middle);
  }
  const onSubmit = async (
    values: Values,
    { setSubmitting, resetForm }: FormikHelpers<Values>,
  ) => {
    try {
      // eventTracker('FirstOtpFlowAction', { action: 'auto_submitted', auto_submitted: true });
      eventTracker('RLending_BankStatementFirstOTPScreen', { action: 'OTP_submitted', type: 'auto' });
      setLoader({ ...loader, status: true, info: 'Logging User In' });
      const I_CLIENTIP = await getIPAddress();
      if (values.otp.length === 6) {
        setDisable(false)
      }
      const payload: ValidateOTPRequestBody = {
        I_MOBILENUMBER: decrypt?.mobile || '',
        I_MOBOTP: (values.otp.toString()).replaceAll(",", ""),
        I_BROWSER: browserName,
        I_CLIENTIP,
        I_Flag: 'M',
      };
      if (location.pathname != '/link-account') {
        const VerifyOTPResponse = await VerifyLoginOtp(payload);
        if (VerifyOTPResponse.RESULT_CODE === '200') {
          initialValues = { 'otp': ['', '', '', '', '', ''] }
          sessionStorage.clear();
          eventTracker('RLending_BankStatementFirstOTPScreen', { action: 'otp_verified' });
          setMessage('Verified Successfully');
          setIsVerified(true);
          dispatch({
            type: UPDATE_LOGIN_SESSION_ID,
            sessionid: VerifyOTPResponse.SESSION_ID,
          });
          if (decrypt?.fipid) {
            navigate('/link-account');
          }
        } else if (VerifyOTPResponse?.RESULT_CODE === '400' && VerifyOTPResponse?.MESSAGE === "Account Locked , Try again after 30 minutes") {
          navigate("/OtpExceed")
        }
        else {
          // eventTracker('FirstOtpFlowAction', { action: 'otp_verification_failed', reason: VerifyOTPResponse.MESSAGE });
          eventTracker('RLending_BankStatementFirstOTPScreen', { action: 'incorrect_otp_submitted' });
          logEvent({
            category: 'Landing Page',
            action: 'LOGIN OTP',
            label: 'Unique Customers/Sessions who have entered OTP',
            value: 0,
          });
          // setTimeout(()=>{resetForm()},1000)
          setHasError(true);
          setDisable(true)
          setIsVerified(false);
          setMessage('Incorrect OTP. Please enter correct OTP');
        }
      }
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
    } finally {
      setLoader({ ...loader, status: false });
    }
  };

  return (
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
                {decrypt?.mobile ? 'XXXXX-' + decrypt?.mobile.substr(5) : (
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
              <Box id="middle" component="form" noValidate onSubmit={handleSubmit}>
                <FormOTPInput
                  name="otp"
                  label="Enter OTP"
                  event="RLending_BankStatementFirstOtpScreen"
                  isVerified={isVerified}
                  setMessage={setMessage}
                  message={message}
                  onFocus={focus}
                  hasError={hasError}
                  onSubmit={() => {
                    handleSubmit();
                  }} />
                <Box className="positivity">
                  <Typography sx={{ color: '#D5CDF2', fontSize: '14px', fontWeight: '400', textAlign: 'left' }} className={`change ${resend == 'Resend' ? 'flowin' : 'flowout'}`}>OTP has been sent again</Typography>
                  <ResendOtp
                    counter={timer}
                    startTimer={startTimer}
                    onResendOtp={() => onResend(resetForm)} />
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
    </Grid>
  );
}

