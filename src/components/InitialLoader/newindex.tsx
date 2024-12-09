import { CardMedia, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomDecryptRequestBody, DecryptRequestBody, RegisterLoginRequestBody, decryptParameters, getIPAddress, registerLoginUser } from "../../api/login";
import { AES256_XOR_DECRYPT_SUCCESS, AuthState, UPDATE_SDK_TYPE, LoginData, UpdatedSatus } from "../../store/types/login";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { browserName, eventTracker, logEvent, mobileSDKRedirect, setGAUserId } from "../../lib/helper";
import { useTimer } from '../../hooks/useTimer';
import { RootStateType } from "../../store/reducers";
import { Box } from '@mui/system';
const API_AUTH_URL = import.meta.env.VITE_Auth_url;

export default function InitialLoader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { decrypt, sdkType } = useSelector<RootStateType, AuthState>(
    (state) => state.auth,
  );
  let timer: any;
  const [searchParams] = useSearchParams();
  const [animate, setAnimate] = useState('verify');
  const [loader, setLoader] = useState({
    status: true,
    info: 'We have partnered with CAMSfinserv, an RBI registered Account Aggregator for fetching your data, you will shortly receive an OTP from CAMSfinserv',
    subInfo: '',
    moreInfo: '',
  });

  const decryptBody: CustomDecryptRequestBody = {
    data: JSON.parse(searchParams.get('data')!)
  };

  useEffect(() => {
    dispatch({ type: UPDATE_SDK_TYPE, body: { sdkType: browserName } });
    setAnimate('verify');
    eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'otp_transition_screen_shown', screen_text:'Verifying your number',screen:'otp_transition_screen_shown' });
    authentication()
  }, []);


  const authentication = () => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      fiuID: decryptBody.data.fiuID,
      redirection_key: decryptBody.data.redirection_key,
      userId: decryptBody.data.userId
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    }

    fetch(`${API_AUTH_URL}/api/FIU/Authentication`, requestOptions)
      .then(async (response) => await response.json())
      .then((result) => {
        redirectionAA(result.sessionId, result.token)
      })
      .catch((error) => {
        dispatch({ type: UpdatedSatus, body: 'verifyNumber' });
        MakeRedirection()
      })
  }
  const redirectionAA = (session: any, token: any) => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${token}`)
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      clienttrnxid: decryptBody.data.clienttrnxid,
      fiuID: decryptBody.data.fiuID,
      userId: decryptBody.data.userId,
      aaCustomerHandleId: `${decryptBody.data.aaCustomerMobile}@CAMSAA`,
      aaCustomerMobile: decryptBody.data.aaCustomerMobile,
      sessionId: session,
      useCaseid: decryptBody.data.useCaseid,
      //  fipid: 'fipuat@citybank' /* HDFC */
      fipid: decodeURI(decryptBody.data.fipid)
    })
    dispatch({ type: LoginData, body: raw });
    sessionStorage.setItem('LoginData',JSON.stringify(raw))
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    }

    fetch(`${API_AUTH_URL}/api/FIU/RedirectAA`, requestOptions)
      .then(async response => await response.json())
      .then(result => {
        let params = new URL(result.redirectionurl).searchParams
        setAnimate('sendotp')
        eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'otp_transition_screen_shown', screen_text:'Sending OTP',screen:'otp_transition_screen_shown' });
        const decryptQuery: DecryptRequestBody = {
          fiuId: params.get('fi')!,
          ecRequest: params.get('ecreq')!,
          reqDate: params.get('reqdate')!,
        };
        setTimeout(() => {
          callApi(decryptQuery);
        }, 1000)
      })
      .catch(error => {
        dispatch({ type: UpdatedSatus, body: 'verifyNumber' });
        MakeRedirection();
      })
  }

  async function callApi(
    decryptRequestBody: DecryptRequestBody,
  ) {
    try {
      const decryptResponse = await decryptParameters(decryptRequestBody);
      dispatch({ type: AES256_XOR_DECRYPT_SUCCESS, body: decryptResponse });
      setGAUserId(decryptResponse.userid);
      logEvent({
        category: 'Landing Page',
        action: '1 FIP Redirection',
        label: 'Unique Customers/Sessions on the landing page',
        value: 1,
      });
      setAnimate('getotp')
      eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'otp_transition_screen_shown', screen_text:'Getting OTP',screen:'otp_transition_screen_shown' });
      setTimeout(() => {
        callRegisterLoginAPI(decryptResponse);
      }, 1000)
    } catch (err) {
      // mobileSDKRedirect(sdkType!, {
      //   errorcode: 500,
      //   errormessage: (err as Error).message,
      // });
      dispatch({ type: UpdatedSatus, body: 'verifyNumber' });
      MakeRedirection();
    }
  }

  // callApi(decryptBody);

  const callRegisterLoginAPI = async (xorDecryptData: any) => {
    const decryptRes = xorDecryptData ?? decrypt;
    const I_CLIENTIP = await getIPAddress();
    const registerLoginBody: RegisterLoginRequestBody = {
      I_MOBILENUMBER: decryptRes?.mobile,
      I_CLIENTIP,
      I_BROWSER: browserName,
      I_MPIN: '123456',
    };
    try {
      const registerResponse = await registerLoginUser(registerLoginBody);
      if (registerResponse?.RESULT_CODE === '200') {
        setAnimate('receivedotp')
        setTimeout(() => {
          navigate('/landing');
        }, 1000)
        eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'otp_transition_screen_shown', screen_text:'OTP received',screen:'otp_transition_screen_shown' });
      }else if(registerResponse?.RESULT_CODE === '400' && registerResponse?.MESSAGE === "Account Locked , Try again after 30 minutes" ){
        navigate("/OtpExceed")
     }
      else {
        MakeRedirection()
      }
    } catch (err) {
      dispatch({ type: UpdatedSatus, body: 'FailedOtp' });
      MakeRedirection()
    }
    setLoader({ ...loader, status: false });
  };

  function MakeRedirection() {
    navigate('/Error')
  }

  return (
    <Grid sx={{ height: '80vh', backgroundColor: '#272239', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#fff', textAlign: 'center',gap:'20px' }}>
        <Box>
        <CardMedia
           sx={{display:'none'}}
          component="img"
          src="/images/warning.svg"
        />
        <CardMedia
             sx={{display:'none'}}
          component="img"
          src="/images/WhatsApp-icon.svg"
        />
        <CardMedia
          component="img"
          src="/images/otp_loader.gif"
          alt="icon"
          sx={{ width: '200.464px', height: '129.5px', }}
        />
      </Box>
      <Box className="positivity">
        <div className={`change dot ${animate == 'verify' ? 'flowin' : 'flowout'}`}>Verifying your number</div>
        <div className={`change dot ${animate == 'sendotp' ? 'flowin' : ''} ${animate == 'getotp' ? 'flowout' : ''}`}>Sending OTP</div>
        <div className={`change dot ${animate == 'getotp' ? 'flowin' : ''} ${animate == 'receivedotp' ? 'flowout' : ''}`}>Getting OTP</div>
        <div className={`change ${animate == 'receivedotp' ? 'flowin' : ''}`}>OTP received</div>
      </Box>
    </Grid>
  )
}