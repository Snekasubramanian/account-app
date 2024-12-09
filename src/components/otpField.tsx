import { Box, Button, Typography } from '@mui/material';
import "@fontsource/inter";

export function ResendOtp({ counter = 10, onResendOtp }: any) {
  const disabled = counter > 0;
  const onResend = () => {
    if (!!onResendOtp && typeof onResendOtp === 'function') {
      onResendOtp();
    }
  };

  return (
    <Box sx={{position:'relative', textAlign: 'right'}}>
      {counter === 0 && (
        <Typography className="resend_otp" sx={{  lineHeight: '20px',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily :'Inter',}}>
          <Button
            variant="text"
            disableRipple
            style={{
              textDecorationColor: '#D5CDF2',
            }}
            sx={{
              color: '#D5CDF2',
              textTransform: 'none',
              textDecoration: disabled ? 'none' : 'underline',
              textUnderlineOffset: '2.5px',
              padding:'0px',
              '&:hover': {
                backgroundColor: '#272239',
                textDecoration: disabled ? 'none' : 'underline',
              },
            }}
            disabled={disabled}
            onClick={onResend}
          >
            Resend OTP
          </Button>
        </Typography>
      )}
      {counter > 0 && (
        <Typography
          sx={{
            display: 'inline',
            fontSize: '14px',
            fontWeight: 400,
            padding: 0,
            color: '#ACA1D3',
            lineHeight: '21px',
            fontFamily:'Inter',
            backgroundColor: 'transparent'
          }}
        >
          Resend OTP in&nbsp;<span className='span-style'>00:{counter}</span>
        </Typography>
      )}
    </Box>
  );
}



