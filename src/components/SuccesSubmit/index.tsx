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
import images from '../../../public/images/submit.json'
import { useEffect } from 'react';
import LottieAnima from '../lottie/LottieAnima';

export default function SuccesSubmit() {


    return (
        <div className="success-submit" >
            {/* top session */}
            <Box>
                <div className="submit-box">
                <LottieAnima lottieAnimation={images}></LottieAnima>
                </div>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px'
                }}>

                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20.0002 1.81787C30.0344 1.81787 38.182 9.9649 38.182 19.9997C38.182 30.0339 30.0344 38.1815 20.0002 38.1815C9.96539 38.1815 1.81836 30.0339 1.81836 19.9997C1.81836 9.9649 9.96539 1.81787 20.0002 1.81787Z" fill="#1EA787" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M29.5794 16.6367L18.5302 27.3036C18.0746 27.739 17.443 27.9389 16.8198 27.8449C16.1998 27.7533 15.6566 27.3813 15.347 26.8364L10.1594 21.152C9.6103 20.169 9.96204 18.9271 10.945 18.378C11.9279 17.829 12.7632 18.378 13.7189 19.1636L17.5939 22.5251L26.7445 13.6272C27.5589 12.8419 28.8557 12.8654 29.6411 13.6797C30.4265 14.4941 30.403 15.791 29.5886 16.5763L29.5794 16.6367Z" fill="white" />
                    </svg>
                    <Typography className='submit-title'>You’re almost there</Typography>
                    <Typography className='submit-sub'>Please do not close this app or minimise it</Typography>
                </Box>
            </Box>
            {/* Top session end */}
            {/* do you know */}
            <Box className="know-box">
                <div className="">
                    <div className=" img-box">
                        <CardMedia
                            component="img"
                            src="/images/doyouknow.svg"
                            alt="Do you know"
                        />
                    </div>
                    <Typography className='box-head'>Do you know ?</Typography>

                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="328" height="2" viewBox="0 0 328 2" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.0023V0.0023H328V1.0023H0Z" fill="url(#paint0_radial_2957_2942)" />
                    <defs>
                        <radialGradient id="paint0_radial_2957_2942" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(164 0.5) rotate(90) scale(0.5 164)">
                            <stop stop-color="white" stop-opacity="0.42" />
                            <stop offset="1" stop-color="white" stop-opacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                <Typography className='box-sub'>Having a good credit score helps you secure a loan more conveniently</Typography>
            </Box>
            {/* do you know end*/}


        </div>

    );
}