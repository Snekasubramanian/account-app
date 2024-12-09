import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {
  CardMedia,
  styled,
  Typography,
  Skeleton,
  Drawer,
  Button,
} from '@mui/material';
import { Box } from '@mui/material';

import { Lst } from '../../api/banks';
import { formatDate } from '../../lib/helper';
import RedirectingModal from '../RedirectingModal';
import { useState } from 'react';
import "@fontsource/inter";

const DividerWrapper = styled('div')({
  paddingTop: '20px',
  paddingBottom: '20px',
  display: 'inline-block',
  '&::before, &::after': {
    position: 'absolute',
    zIndex: -1,
    content: '""',
    top: 0,
    bottom: '50%',
    left: '35px',
    'border-top': 0,
    'border-left': '2px solid rgba(0, 0, 0, 0.12)',
    transform: 'translateY(2px)',
  },
  '&::after': {
    top: '50%',
    bottom: 0,
  },
});

function VerticalDividerItem({
  children,
  hideTop = false,
  hideBottom = false,
}: {
  children: any;
  hideTop?: boolean;
  hideBottom?: boolean;
}) {
  const sx1 = hideTop === true ? { '&::before': { display: 'none' } } : {};
  const sx2 = hideBottom === true ? { '&::after': { display: 'none' } } : {};
  return (
    <DividerWrapper sx={{ ...sx1, ...sx2 } as any}>
      <span>{children}</span>
    </DividerWrapper>
  );
}

export default function ConsentDetailsDrawer({
  consentDrawer,
  setConsentDrawer,
  consentDetails,
}: {
  consentDrawer: boolean;
  // eslint-disable-next-line no-unused-vars
  setConsentDrawer: (value: boolean) => void;
  consentDetails: Lst[];
}) {
  const { FIDATAFROMDATE, FIDATATODATE, MCONSENTEXPIRYDATETIME } = consentDetails[0];
  const [loader, setLoader] = useState({
    status: false,
    info: '',
    subInfo: '',
    moreInfo: '',
  });
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setConsentDrawer(consentDrawer);
    };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={consentDrawer}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          '& .MuiDrawer-paper': {
            bgcolor: 'transparent'
          }
        }}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 400,
            backgroundColor: '#2E2942',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <Box sx={{ height: '60px' }}>
            <Box sx={{ marginTop: 2, marginRight: 2, textAlign: 'right', cursor: 'pointer' }}>
              <CardMedia
                component="img"
                src="/images/big cross.svg"
                alt="icon"
                sx={{ maxHeight: '24px', width: '24px', display: 'inline' }}
                onClick={() => setConsentDrawer(false)}
              />
            </Box>
          </Box>
          <Box sx={{ marginTop: 2, margin: '0px 16px' }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '28px',
                color: 'white',
              }}
            >
              What do you share with us?
            </Typography>
          </Box>
          <Box sx={{ marginTop: 1, margin: '0px 16px' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#EEEAFF',
                display: 'flex',
                fontFamily: "Inter",
                lineHeight: '20px',
                weight: 400,
                gap: '8px',
                marginTop: 1,
              }}
            >
              <AccountCircleOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />{' '}
              {consentDetails ? (
                'Basic profile details - Name, PAN & Age'
              ) : (
                <Skeleton width="70%" />
              )}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#EEEAFF',
                display: 'flex',
                fontFamily: "Inter",
                lineHeight: '20px',
                weight: 400,
                gap: '8px',
                marginTop: 1,
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
              {FIDATAFROMDATE && FIDATATODATE ? (
                `Bank statements since
              ${formatDate(FIDATAFROMDATE)}`
              ) : (
                <Skeleton width="70%" />
              )}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#EEEAFF',
                display: 'flex',
                fontFamily: "Inter",
                lineHeight: '20px',
                weight: 400,
                gap: '8px',
                marginTop: 1,
              }}
            >
              <AccessTimeOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
              {MCONSENTEXPIRYDATETIME ? (
                `Your consent is valid till one year`
              ) : (
                <Skeleton width="80%" />
              )}
            </Typography>
          </Box>
          <Box sx={{position:'fixed',bottom:'16px',width:'100%'}}>
          <Box sx={{ width:'100%',margin:'auto',paddingBottom:'8px'}}>
            <CardMedia
              component="img"
              src="/images/safe and secure data.svg"
              alt="icon"
              sx={{ maxHeight: '16px', width: '154px',margin:'auto'}}
            />
          </Box>
          <Box sx={{ height: '56px',margin:'0 16px'}}>
            <Button
              sx={{
                color: 'white',
                border: '2px solid #846FC0',
                width: '100%',
                height: '56px',
                borderRadius: '12px',
                textTransform:'none',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: '20px',
                fontStyle: 'normal'
              }}
              onClick={() => setConsentDrawer(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
        </Box>
      </Drawer>
      {/* <RedirectingModal info={loader.info} opened={loader.status} /> */}
    </>
  );
}
