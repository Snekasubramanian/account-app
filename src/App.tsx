import 'react-alice-carousel/lib/alice-carousel.css';
import { Grid, Paper, Stack, SxProps, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/system';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import LinkAccount from './components/LinkAccount/LinkAccount';
import LoginRouter from './components/login';
import { eventTracker, initializeGoogleAnalytics, setupGAPageView } from './lib/helper';
import ScrollToTop from './lib/scrollToTop';
import { store } from './store';
import InitialLoader from './components/InitialLoader/newindex';
import { MobileNumberContainer } from './components/BottomDrawer/BottomDrawer';
import Success from './components/Success';
import Warning from './components/Warning';
import ChangeOtp from './components/ChangeOtp';
import OtpExceed from './components/WarningPage/OtpExceed';
import ErrorPage from './components/Errorpage/errorpage';
import SuccesSubmit from './components/SuccesSubmit';
import ConfirmAccount from './components/LinkAccount/ConfirmAccount';
initializeGoogleAnalytics();

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener('offlineEvent', () => {
      navigate('/Error')
    });
    setupGAPageView();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Error registering service worker:', error);
        });
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <Provider store={store}>
        <ScrollToTop />
        <AppRoutes />
      </Provider>
    </>
  );
}

export function PoweredBy({ sx = {} }: { sx?: SxProps }) {
  return (
    <Box sx={{ background: '#fff', textAlign: 'center', width: '100%', ...sx }}>
      <Typography
        sx={{ fontSize: 12, color: '#333', fontWeight: 500, display: 'inline-flex' }}
      >
        Powered by &nbsp;
        <img src="/images/cams-finserv.svg" alt="icon" />
      </Typography>
    </Box>
  );
}

function LayoutComponent() {
  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={{
        bgcolor: 'background.primary',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Grid
        sx={{
          minHeight: '100vh',
          width: '100%',
          maxWidth: '500',
          margin: 'auto',
          backgroundColor: '#272239'
        }}
      >
        <Grid container component="main">
          <Grid
            item
            xs={12}
            component={Paper}
            square
            sx={{
              boxShadow: 'none',
              marginTop: '56px'
            }}
          >
            <Outlet />
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LayoutComponent />}>
        <Route path="/" element={<InitialLoader />} />
        <Route path="/login" element={<InitialLoader />} />
        <Route path="/landing" element={<LoginRouter />} />
        <Route path="/link-account" element={<LinkAccount />} />
        <Route path="/Add-mobile" element={<MobileNumberContainer />} />
        <Route path="/otp-verification" element={<ChangeOtp />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/Confirm" element={<ConfirmAccount />} />
        <Route path="/Warning" element={<Warning />} />
        <Route path="/OtpExceed" element={<OtpExceed />} />
        <Route path="/Error" element={<ErrorPage />} />
        <Route path="/SuccesSubmit" element={<SuccesSubmit />} />
      </Route>
    </Routes>
  );
}

export default App;

