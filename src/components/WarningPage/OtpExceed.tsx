import {
    Box,
    Typography,
    Button
} from '@mui/material';
import Header from '../header';
import { RootStateType } from '../../store/reducers';
import { AuthState } from '../../store/types/login';
import { useSelector } from 'react-redux';
import { closeAndRedirect, eventTracker } from '../../lib/helper';
import { useEffect } from 'react';

export default function OtpExceed() {

    const { decrypt } = useSelector<RootStateType, AuthState>(
        (state) => state.auth,
      );

      useEffect(()=>{
        eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'limit_exceeded_screen_shown',screen:'limit_exceeded_screen' });
      },[]);

    return (
        <div>
            <Header label="" />
            <div className="warning-exceed ">
                {/* Warning page */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.81543 43.9909C4.81543 22.3408 22.3669 4.78931 44.0178 4.78931C65.6688 4.78931 83.2202 22.3408 83.2202 43.9909C83.2202 65.6419 65.6688 83.1933 44.0178 83.1933C22.3669 83.1933 4.81543 65.6419 4.81543 43.9909ZM44.0178 3.78931C21.8146 3.78931 3.81543 21.7885 3.81543 43.9909C3.81543 66.1942 21.8146 84.1933 44.0178 84.1933C66.221 84.1933 84.2202 66.1942 84.2202 43.9909C84.2202 21.7885 66.221 3.78931 44.0178 3.78931ZM80.9701 43.991C80.9701 23.5833 64.4255 7.03861 44.0177 7.03861C23.6093 7.03861 7.06535 23.5833 7.06535 43.991C7.06535 64.3995 23.6093 80.9434 44.0177 80.9434C64.4255 80.9434 80.9701 64.3995 80.9701 43.991Z" fill="#FF453A" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M40.267 49.6101C40.267 51.6815 41.9463 53.3609 44.0178 53.3609C46.0892 53.3609 47.7685 51.6815 47.7685 49.6101V26.5476C47.7685 24.4762 46.0892 22.7969 44.0178 22.7969C41.9463 22.7969 40.267 24.4762 40.267 26.5476V49.6101ZM39.8496 61.1354C39.8496 63.4375 41.7157 65.3036 44.0178 65.3036C46.3198 65.3036 48.1859 63.4375 48.1859 61.1354C48.1859 58.8341 46.3198 56.968 44.0178 56.968C41.7157 56.968 39.8496 58.8341 39.8496 61.1354Z" fill="white" />
                        </svg>
                        <Box  sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Typography className='warning-heat'>OTP limit has been exceeded
                                after too many wrong attempts.</Typography>
                            <Typography className="warning-sub">Please try again after 30 mins</Typography>
                        </Box>
                    </Box>
                    <div className="go-btn">

                        <Button
                            variant="text"
                            onClick={() => {
                                  closeAndRedirect({
                                    parentStatusMessage: 'N',
                                    delay: true,
                                    decrypt,
                                    url: decrypt?.redirect,
                                  });
                                eventTracker('RLending_BankStatementFirstOtpScreen',{
                                  action: 'go_back_clicked',screen:'limit_exceeded_screen'
                                })
                              }}
                        >
                          Go Back
                        </Button>
                    </div>
                </Box>

                {/* Warnig page */}



            </div>
        </div>
    );
}