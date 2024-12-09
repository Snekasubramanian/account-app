import { Button, CardMedia, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomDecryptRequestBody, DecryptRequestBody, RegisterLoginRequestBody, decryptParameters, getIPAddress, registerLoginUser } from "../../api/login";
import { AuthState, LoginData, AES256_XOR_DECRYPT_SUCCESS } from "../../store/types/login";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { browserName, eventTracker, logEvent, mobileSDKRedirect, setGAUserId } from "../../lib/helper";
import { useTimer } from '../../hooks/useTimer';
import { RootStateType } from "../../store/reducers";
import { Box } from '@mui/system';
import Header from "../header";

export default function ErrorPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDisable, setisDisable] = useState(false);
  const { decrypt, userData, CurrentStatus } = useSelector<RootStateType, AuthState>(
    (state) => state.auth,
  );
  let timer: any;
  const [searchParams] = useSearchParams();

  const decryptBody: CustomDecryptRequestBody = {
    data: JSON.parse(searchParams.get('data')!)
  };

  useEffect(() => {
    eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'something_went_wrong_screen_shown', screen_text:'Something went wrong', screen:'something_went_wrong_screen'});
    dispatch({ type: LoginData, body: JSON.parse(JSON.stringify(sessionStorage.getItem('LoginData'))) });
  }, [])
  const retry = () => {
    eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'retry_clicked', screen_text:'Retry', screen:'something_went_wrong_screen'});
    if (CurrentStatus == 'verifyNumber') {
      var newurl = window.location.protocol + "//" + window.location.host + `/login?data=${userData}`;
      window.location.href = newurl;
    } else {
      callRegisterLoginAPI();
    }
  }

  window.addEventListener('onlineEvent', () => {
    setisDisable(false);
  });

  window.addEventListener("offlineEvent", (event) => {
    setisDisable(true);
  })

  const callRegisterLoginAPI = async () => {
    const decryptRes = decrypt;
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
        setTimeout(() => {
          navigate('/landing');
        }, 1000)
        eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'otp_sent' });
      }
    } catch (err) { }
  };

  return (
    <Grid sx={{ backgroundColor: '#272239' }}>
      <Header label="" />
      <Box sx={{ height: '80vh', gap: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

        <Box sx={{ gap: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <CardMedia
            component="img"
            src="/images/warning.svg"
            alt="icon"
            sx={{ Height: '72px', width: '72px', }}
          />
          <Box className="error-page">
            <Typography sx={{ color: '#FFF', fontSize: '18px', fontWeight: '700' }}>Something went wrong!</Typography>
            <Typography sx={{ color: '#D5CDF2', fontSize: '14px', fontWeight: '400' }}>Something unexpected happened, please try again</Typography>
          </Box>
        </Box>
        <Button disabled={isDisable} sx={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', backgroundColor: '#6637E4 !important', height: '56px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.20)', padding: '0px 129px', gap: '8px', textTransform: 'inherit', fontFamily: 'Inter','& .MuiButton-root':{color :'#FFFFFF'}, '&:disabled': {color :'#FFFFFF'} }} onClick={() => retry()}>Retry</Button>
      </Box>
    </Grid>

  )
}

