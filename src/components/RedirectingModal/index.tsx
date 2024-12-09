import { Box, CardMedia, Dialog, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function RedirectingModal({
  info = '',
  moreInfo = '',
  subInfo,
  opened = false,
  setModal,
  LoadingProgress,
}: {
  info?: string;
  subInfo?: string;
  moreInfo?: string;
  opened?: boolean;
  setModal?: any;
  LoadingProgress?: any;
}) {
  const handleClose = () => {
    setModal(false);
  };

  return (
    <>
      <Dialog
        open={opened}
        onClose={(e, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        sx={{
          '& .MuiBackdrop-root': { backgroundColor: '#272239' },
          '& .MuiPaper-root': {
            background: 'transparent',
            boxShadow: 'none',
            textAlign: 'center',
            alignItems: 'center',
            margin: 1,
          },
        }}
      >
        {/* <Box
          sx={{
            display: 'inline-block',
            position: 'relative',
            width: '110px',
            height: '110px',
            zIndex: 9,
            margin: 'auto',
            marginBottom: '20px',
            '& .MuiGrid-root': {
              //boxSizing: 'border-box',
              display: 'block',
              position: 'absolute',
              width: '94px',
              height: '94px',
              margin: '8px',
              border: '7px solid #272239',
              borderRadius: '50%',
              animation: 'lds-ring 2.5s cubic-bezier(0.5, 0, 0.5, 1) infinite',
              borderColor: '#D5CDF2 #272239 #272239 #272239',
              backgroundColor: '#272239',
              '&:nth-of-type(1)': {
                animationDelay: '0.45s',
              },
              '&:nth-of-type(2)': {
                animationDelay: '0.3s',
              },
              '&:nth-of-type(3)': {
                animationDelay: '0.15s',
              },
            },
            '@keyframes lds-ring': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
          }}
        > 
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
          <Grid></Grid>
          <Grid style={{ borderColor: '#DCE2F7', zIndex: -1 }}></Grid>
        </Box> */}
        <CardMedia
          component="img"
          src="images/loader.gif"
          alt="icon"
          sx={{ height: '70px', width: '70px', borderRadius: '50%', display: 'inline' }}
        //onClick={() => setOtpDrawer(false)}
        />
        <Typography
          sx={{ 
            fontSize: '18px', 
            fontWeight: 700, 
            lineHeight: '26px',
            fontFamily: 'Inter',
            color: '#fff', 
            marginBottom: '8px' }}
        >
          {info}
          {moreInfo && (
            <>
              <br />
              {moreInfo}
            </>
          )}
        </Typography>
        {subInfo && (
          <Typography sx={{ 
            fontSize: '14px', 
            fontWeight: 400,
            lineHeight: '20px',
            fontFamily: 'Inter',
            color: '#D5CDF2' 
             }}>
            {subInfo}
          </Typography>
        )}
      </Dialog>
    </>
  );
}
