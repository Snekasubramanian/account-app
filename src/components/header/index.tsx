import ArrowBackIcon from '@mui/icons-material/ArrowBack';
//import  from '@mui/icons-material/';
import whatsapp from '../../../public/images/WhatsApp-icon.svg';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Box,
  Button,
  CardMedia,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { ConsentRejectRequestBody, rejectConsent } from '../../api/banks';
import { browserName, closeAndRedirect, eventTracker } from '../../lib/helper';
import { RootStateType } from '../../store/reducers';
import { AuthState } from '../../store/types/login';
import DrawerWrapper from '../BottomDrawer/DrawerWrapper';
import RedirectingModal from '../RedirectingModal';
import { Height } from '@mui/icons-material';
import DetailsDrawer from '../BottomDrawer/DetailsDrawer';
import "@fontsource/inter";
import { BankState } from '../../store/types/bankListType';

export default function Header({ label, clearSession, errorCount }: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const [reject, setReject] = useState(false);
  const [loader, setLoader] = useState({
    status: false,
    info: '',
    subInfo: '',
    moreInfo: '',
  });
  const { decrypt } = useSelector<RootStateType, AuthState>((state) => state.auth);
  const [Drawer, setDrawer] = useState(false);
  const { bankList, } = useSelector<RootStateType, BankState>(
    (state) => state.bank,
  );

  const submitflag = location.pathname ==  "/link-account" ? false : true;
  const rejectConsentCall = async () => {
    //setLoader({ ...loader, status: true, info: 'Rejecting Consent' });
    const rejectBody: ConsentRejectRequestBody = {
      I_MOBILENUMBER: decrypt!.mobile,
      I_BROWSER: browserName,
      I_ConsentId: decrypt?.srcref,
      I_STATUS: 'REJECTED',
    };
    const rejectResponse = await rejectConsent(rejectBody);
    if (rejectResponse) {
      closeAndRedirect({
        parentStatusMessage: 'REJECTED',
        delay: true,
        decrypt,
        url: decrypt?.redirect,
      });
    }
  };

  const needHelp = () => {
    if (location.pathname == '/link-account' && window.location.pathname == '/Confirm') {
     if(bankList?.length > 0){
      eventTracker('Lending_NeedHelpClicked', { screen: 'link_account_screen' });
     }else{
      eventTracker('Lending_NeedHelpClicked', { screen: 'link_account_screen_no_accounts' });
     }
    }else if(window.location.pathname == '/Add-mobile'){
      eventTracker('Lending_NeedHelpClicked', { screen: 'change_number_screen' });
    }else if(window.location.pathname == '/OtpExceed'){
       eventTracker('Lending_NeedHelpClicked', { screen: 'bank_statement_first_otp_limit_exceeded' });
     } else {
     eventTracker('Lending_NeedHelpClicked', { screen: 'bank_statement_first_otp' });
    }
  }
  return (
    <Grid item xs={12}>
      <AppBar
        sx={{
          boxShadow: 'none',
          backgroundColor: '#272239',
        }}
      >
        <Box
          sx={{
            // height: '56px',
            backgroundColor: '#272239',
            borderBottom: '1px solid #3C3357',
            // boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
            // border:'solid green'
          }}
        >
          <Box
            sx={{
              width: '100%',
              // height:'56px',
              display: 'flex',
              // border:'solid red',
              padding: '16px 16px 16px 16px',
              alignItems: 'center',
              justifyContent:'space-between',
            }}
          >
            <div className="" style={{display:'flex',alignItems:'center',gap:'16px'}}>
              {(location.pathname !== '/link-account' && location.pathname !== '/Confirm') ? (
                <Box sx={{}}>
                  <ArrowBackIcon
                    sx={{ color: 'white',
                     position: 'relative', top: '3px'
                     }}
                    onClick={() => {
                      if(window.location.pathname == '/Add-mobile'){
                        window.history.back();
                        eventTracker('Lending_BackButtonClicked', { screen: 'change_number_screen' });
                      }else if(window.location.pathname == '/OtpExceed'){
                        eventTracker('Lending_BackButtonClicked', { screen: 'bank_statement_first_otp_limit_exceeded' });
                        closeAndRedirect({
                          parentStatusMessage: 'N',
                          delay: true,
                          decrypt,
                          url: decrypt?.redirect,
                        });
                      }else{
                        setLoader({
                          ...loader,
                          status: true,
                        });
                        eventTracker('Lending_BackButtonClicked', { screen: 'bank_statement_first_otp' });
                        closeAndRedirect({
                          parentStatusMessage: 'N',
                          delay: true,
                          decrypt,
                          url: decrypt?.redirect,
                        });
                      }
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{}} onClick={clearSession}>
                  <ArrowBackIcon
                    sx={{ color: 'white', position: 'relative', top: '3px' }}
                    onClick={() => { 
                     if(bankList?.length > 0){
                       eventTracker('Lending_BackButtonClicked', { screen: 'link_account_screen' });
                       setDrawer(true); 
                     }else{
                      eventTracker('Lending_BackButtonClicked', { screen: 'link_account_screen_no_accounts' });
                     }
                    }}
                  />
                </Box>
              )}
              <Box

              >
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontFamily: "Inter",
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: '20px',
                    position: 'relative',
                    // top: '3px',
                    // marginLeft: '10px',
                    // padding:'2px 0px'
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </div>
            <Box
              sx={{
                // height:'28px',
                cursor: 'pointer',
                borderRadius: '4px',
                border: '1px solid #776E94',
                padding: '5px 9px 5px 9px',
                // float:'right',
                display: 'flex',
                // width:'110px',
                // maxWidth: '130px',
              }}
              onClick={() => needHelp()}
            >
              <CardMedia
                component="img"
                src="/images/WhatsApp-icon.svg"
                alt="icon"
                sx={{ height: '16px', width: '16px', display: 'inline' }}
              />
              <Box
                sx={{
                  // width:'69px',
                  // height: '18px',
                  alignItem: 'center',
                  justifyContent: 'center',
                  // margin: '0px 3px'
                  paddingLeft: '3px'
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '18px',
                    '@media screen and (max-width: 400px)': {
                      fontSize:'11px'
                     },
                  }}
                >
                  Need Help?
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <RedirectingModal
          info={loader.info}
          moreInfo={loader.moreInfo}
          subInfo={loader.subInfo}
          opened={loader.status}
          setModal={(type: any) => setLoader({ ...loader, status: type })}
        />
        <DetailsDrawer submitbtn={submitflag} DetailsDrawer={Drawer} setDetailsDrawer={setDrawer} showDecline={false} setLoad={setLoader} load={loader}  errorCount={errorCount}/>
      </AppBar>
    </Grid>
  );
}
