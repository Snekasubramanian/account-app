import { InfoOutlined } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useField } from 'formik';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { eventTracker } from '../../../lib/helper';
import { useLocation } from 'react-router-dom';

export type FormOTPInputProps = TextFieldProps & {
  name: string;
  label?: string;
  message?: string;
  otpLength?: number;
  isVerified?: boolean;
  hasError?: boolean;
  setMessage:any;
  onFocus:any;
  event:string;
  onSubmit?: () => void;
};

export function FormOTPInput({
  name,
  label = 'Confirm bank account',
  otpLength = 6,
  isVerified = false,
  message = '',
  hasError = false,
  onFocus = () =>{},
  setMessage,
  event,
  onSubmit = () => {},
}: FormOTPInputProps) {
  const location = useLocation();
  const [field, meta, { setValue }] = useField<string>(name);
  const errorText = (meta.error && meta.touched ? meta.error : '') || message;
  const hasError1 = !!errorText && hasError;
  const { value } = field;
  // const paddedValue = value.padEnd(otpLength, ' ');
  const discoveredbank: any = (location.state as any)?.discoveredbank;
  let otp:any = value;
  const ref = useRef<any>([]);
  const [isPasteData, setIsPasteData] = useState<boolean>(false);

  const useStyles = makeStyles(() => ({
    root: {
     // marginRight: '12px !important',
      '& .MuiFilledInput-root': {
        '&::after, &::before': {
          display: 'none',
        },
      },
      '& input::placeholder': {
        color: 'white',
        fontSize: '20px',
        opacity: 1,
      },
      '& input': {
        color: 'white',
        fontSize: '20px',
        padding: '0 12px',
        textAlign: 'center',
        borderBottom: '2px solid #776E94',
        boxSizing: 'border-box',
        fontWeight: 700,
        fontFamily: 'Inter',
        // font:'Inter',
        //width: '15%',
        height: '1.85em',
      },
      '& input:focus': {
        borderBottom: '2px solid #FFF',
        backgroundColor: '#272239'
      },
      '& input:hover': {
        backgroundColor: '#272239',
      },
      '& input[value]:not([value = ""])': {
        borderBottom:
          hasError1 && otp.length === otpLength
          ? '2px solid #EB6A6E'
          : '2px solid #FFF',
      },
    },
  }));

  useEffect(() => {
    if (ref.current.length) {
      ref.current[0].focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", (event) => {
      const receivedData:any = event;
      if(location.pathname == '/landing'){
        eventTracker('RLending_BankStatementFirstOTPScreen', { action: 'otp_fetched', type: 'auto' });
      }else if(location.pathname == '/link-account'){
        eventTracker('RLending_BankStatementSecondOtpScreen', { action: 'otp_fetched', type: 'auto' });
      }else{
        eventTracker('RLending_BankStatementLinkAccountFlow', { 
          action: 'otp_fetched', 
          type: 'auto',
          screen: 'change_number_screen',
          bank_name: discoveredbank?.FIPName
        });
      }
      otp = JSON.stringify(receivedData.detail).split("");
      otp.shift();  // Removes the first element from an array and returns only that element.
      otp.pop();
      setValue(otp);
      otpChange(otp[5],5);
      if(!!ref.current[5]){
        ref.current[5].focus();
      }
    });
  },[])

  const otpChange = (value: string, index: number) => {
    if (!/^[\d ]*$/.test(value) || isPasteData) {
      setIsPasteData(false);
      return;
    }
    if(value.length == 6){
      otp = value.split("");
      setValue(otp);
    }
     if ((value && !otp[index].length) || !value) {
      otp[index] = value
      setValue(otp);
      let focusLength = otp.join("").length;
      if (focusLength < otpLength && value) {
        ref.current[otp.findIndex((e:any) => e === '')].focus();
      }
    }
    console.log(otp,value)
    if (otp.join("").length == otpLength) {
      setTimeout(() => {
        onSubmit();
      }, 500);
    }
  };

  const handleKeyDown = (index: number) => (event: any) => {
    // let index = otp.filter((ele: string) => !!ele).length;
    if (event.key == 'Backspace' || event.key === 'Delete') {
      console.log(index)
      setMessage("");
      if (!otp[index]) {
        if (!(index - 1 < 0)) {
          otp[index] = "";
          setValue(otp);
          ref.current[index - 1].focus();
        }
      }
    }
  };


  return (
    <div className="otp-field">
      <FormControl error sx={{width: '100%',}}>
        <Box className="otp-inputs" sx={{ display: 'flex',  justifyContent: 'space-between' }}>
          {otp.map((ele: string, index: number) => (
            <TextField
              className={useStyles().root}
              inputRef={(ele) => (ref.current[index] = ele)}
              focused={ref.current === index}
              onChange={({ target: { value } }) => {
                otpChange(value, index);
                if(index === 5){
                  eventTracker(event, { action: 'otp_fetched', type: 'manual' });
                }
              }}
              onKeyDown={handleKeyDown(index)}
              value={ele}
              onFocus = {onFocus}
              key={index}
              variant="filled"
              // onPaste={(event: any) => handlePaste(event, index)}
              inputProps={{ inputMode: 'numeric', maxLength: 6}}
              type="text"
              autoComplete="off"
              sx={{
                '& input': {
                  borderBottom:
                    hasError1 &&
                    otp.length == otpLength
                      ? '1px solid #EB6A6E'
                      : isVerified
                      ? ''
                      : '',
                },
              }}
            />
          ))}
        </Box>
        {hasError1 ? (
           <Box sx={{display:'flex',marginTop: '12px',marginBottom: '20px'}}>
           <InfoOutlined sx={{color: '#EB6A6E',marginTop:0,width:'16px',height:'16px', marginRight:'4px'}}/>
           <FormHelperText sx={{marginTop:'0px',marginLeft:0,letterSpacing:0,fontFamily: 'Inter',fontSize: '12px',fontWeight:400,lineHeight: '16px' }} style={{ color: '#EB6A6E' }}>{errorText || message}</FormHelperText></Box>
        ) : (
          <FormHelperText sx={{ marginTop: '12px',fontFamily: 'Inter',fontSize: '12px',fontWeight:400,lineHeight: '16px' }} style={{ color: 'green' }}>
            {message}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  );
}
