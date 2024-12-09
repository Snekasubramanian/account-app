import { CardMedia, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DecryptRequestBody, RegisterLoginRequestBody, decryptParameters, getIPAddress, registerLoginUser } from "../../api/login";
import { AES256_XOR_DECRYPT_SUCCESS, AuthState, UPDATE_SDK_TYPE } from "../../store/types/login";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { browserName, eventTracker, logEvent, mobileSDKRedirect, setGAUserId } from "../../lib/helper";
import { useTimer } from '../../hooks/useTimer';
import { RootStateType } from "../../store/reducers";
import { Box } from '@mui/system';
import LinearProgress from '@mui/material/LinearProgress';

export default function InitialLoader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { decrypt, sdkType } = useSelector<RootStateType, AuthState>(
    (state) => state.auth,
  );
  let timer : any ;
  const [searchParams] = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [loader, setLoader] = useState({
    status: true,
    info: 'We have partnered with CAMSfinserv, an RBI registered Account Aggregator for fetching your data, you will shortly receive an OTP from CAMSfinserv',
    subInfo: '',
    moreInfo: '',
  });


  useEffect(() => {
      timer = setInterval(() => {
      setProgress((oldProgress) => {
        const diff = Math.random() * 20;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
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
        callRegisterLoginAPI(decryptResponse);
      } catch (err) {
        mobileSDKRedirect(sdkType!, {
          errorcode: 500,
          errormessage: (err as Error).message,
        });
        console.error(err);
        alert((err as Error).message);
      }
    }

    const decryptBody: DecryptRequestBody = {
      fiuId: searchParams.get('fi')!,
      ecRequest: searchParams.get('ecreq')!,
      reqDate: searchParams.get('reqdate')!,
    };

    if (!decryptBody.fiuId || !decryptBody.ecRequest || !decryptBody.reqDate) {
      return;
    }
    dispatch({ type: UPDATE_SDK_TYPE, body: { sdkType: browserName } });
    callApi(decryptBody);
  }, []);

  const callRegisterLoginAPI = async (xorDecryptData: any) => {
    const decryptRes = xorDecryptData ?? decrypt;
    const I_CLIENTIP = await getIPAddress();
    const registerLoginBody: RegisterLoginRequestBody = {
      I_MOBILENUMBER: decryptRes?.mobile,
      I_CLIENTIP,
      I_BROWSER: browserName,
      I_MPIN: '123456',
    };
    const registerResponse = await registerLoginUser(registerLoginBody);
    if (registerResponse?.RESULT_CODE === '200') {
      clearInterval(timer);
      setProgress((oldProgress) => {
        return 100;
      });
      setTimeout(()=>{
        navigate('/landing');
      },1000)
      // eventTracker('FirstOtpFlowAction', { action: 'otp_screen_launched' });
      eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'otp_sent' });
    }else if(registerResponse?.RESULT_CODE === '400' && registerResponse?.MESSAGE === "Account Locked , Try again after 30 minutes" ){
       navigate("/OtpExceed")
    }
    setLoader({ ...loader, status: false });
  };


  return (
    <Grid sx={{height:'30em', backgroundColor: '#272239' , display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection:'column'}}>
      <Box
        sx={{
          borderRadius: '4px',
          marginBottom: '8px',
          margin:0
        }}
      >
        <CardMedia
          component="img"
          src="/images/mobile-OTP.svg"
          alt="icon"
          sx={{ Height: '76px', width: '76px' }}
        />
      </Box>
      <Box sx={{textAlign: 'center', width: '100%',     margin:0}}>
      <Typography sx={{ color:'#FFFFFF',fontSize: '18px' , fontWeight: 700, lineHeight:'26px',padding:'20px 0px' }}>
      Sending OTP...
      </Typography>
    </Box>
      <Box sx={{     margin:0, width: '100%', backgroundColor: '#272239', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <LinearProgress sx={{
          width: '50%', backgroundColor: '#3C3357', height: '10px', borderRadius: '17px',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#58DDC8'
          }
        }} variant="determinate" value={progress} />
      </Box>
    </Grid>
  )
}