import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    CardMedia,
    Checkbox,
    Grid, 
    Typography,
    Button
} from '@mui/material';
import { useEffect } from 'react';
import { closeAndRedirect } from '../../lib/helper';
import { useSelector } from 'react-redux';
import { RootStateType } from '../../store/reducers';
import { AuthState } from '../../store/types/login';
export default function Success() {
    const { decrypt, addNumberFlow } = useSelector<RootStateType, AuthState>(
        (state) => state.auth,
      );

    useEffect (()=>{
      setTimeout(()=>{
        closeAndRedirect({
              url: decrypt?.redirect,
              parentStatusMessage: 'ACCEPTED',
              decrypt,
            });
      },2000)
    },[])

    return (
        <div className="sussess-page">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
            }}>

                <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none">
                    <path d="M44 4C66.0753 4 84 21.9235 84 44C84 66.0753 66.0753 84 44 84C21.9235 84 4 66.0753 4 44C4 21.9235 21.9235 4 44 4Z" fill="#1EA787" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M65.0743 36.6013L40.7662 60.0685C39.7638 61.0264 38.3743 61.4661 37.0033 61.2593C35.6393 61.0578 34.4441 60.2394 33.763 59.0405L22.3503 46.5348C21.1424 44.3723 21.9162 41.6401 24.0787 40.4321C26.2412 39.2242 28.0787 40.4321 30.1814 42.1605L38.7063 49.5556L58.8376 29.9804C60.6293 28.2526 63.4823 28.3043 65.2101 30.0959C66.9379 31.8875 66.8862 34.7406 65.0946 36.4684L65.0743 36.6013Z" fill="white" />
                </svg>
                <Typography>Bank setup successful</Typography>
            </Box>
        </div>

    );
}