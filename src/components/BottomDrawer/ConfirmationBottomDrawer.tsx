import { Box, Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { ConsentRejectRequestBody, rejectConsent } from '../../api/banks';
import { browserName, closeAndRedirect, logEvent } from '../../lib/helper';
import { RootStateType } from '../../store/reducers';
import { BankState } from '../../store/types/bankListType';
import { AuthState } from '../../store/types/login';
import RedirectingModal from '../RedirectingModal';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmationBottomDrawer({
  confirm,
  message,
  setConfirm,
  type,
  sentvalue,
}: {
  confirm: boolean;
  message: string;
  type: string;
  sentvalue: 0 | 1;
  setConfirm: any;
}) {
  const { decrypt } = useSelector<RootStateType, AuthState>((state) => state.auth);
  const { consumer } = useSelector<RootStateType, BankState>((state) => state.bank);
  const [loader, setLoader] = React.useState({
    status: false,
    info: '',
    subInfo: '',
    moreInfo: '',
  });

  const rejectConsentCall = async () => {
    setLoader({ ...loader, status: true, info: 'Rejecting Consent' });
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
  return (
    <Box>
      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        TransitionComponent={Transition}
        sx={{
          '& .MuiPaper-root': {
            // margin: 0,
            width: '100%',
            maxWidth: '500px',
            margin: 'auto',
          },
        }}
      >
        <Box sx={{ padding: '40px 30px' }}>
          <Grid
            container
            direction="column"
            display="flex"
            spacing={4}
            sx={{ width: '100%', margin: 0, marginBottom: '20px' }}
          >
            <Grid item style={{ paddingLeft: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body1">{message}</Typography>
              </Box>
            </Grid>
            <Grid item style={{ paddingLeft: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontSize: '15px',
                    width: '150px',
                  }}
                  onClick={() => {
                    setLoader({
                      ...loader,
                      status: true,
                      info: type === 'reject' ? 'Your consent has been rejected' : '',
                      moreInfo: '',
                      subInfo: `You will be redirected to ${decrypt!.fiuName}.`,
                    });
                    if (sentvalue === 1) {
                      logEvent({
                        category: 'Link Account Page',
                        action: 'Consent Rejection',
                        label:
                          'Unique Customer user_id/session id where customer clicks on the Reject button and then chooses "Yes,Reject" option on the pop-up',
                        value: 1,
                      });
                    } else {
                      logEvent({
                        category: 'Summary Page',
                        action: 'Consent Rejection',
                        label:
                          'Unique Customer user_id/session id where customer clicks on the Reject button and then chooses "Yes,Reject" option on the pop-up',
                        value: 0,
                      });
                    }
                    setConfirm(false);
                    if (type === 'reject') {
                      rejectConsentCall();
                    } else {
                      closeAndRedirect({
                        parentStatusMessage: 'REJECTED',
                        delay: false,
                        decrypt,
                        url: decrypt?.redirect,
                      });
                    }
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontSize: '15px',
                    width: '150px',
                    color: 'white',
                  }}
                  onClick={() => {
                    setConfirm(false);
                  }}
                >
                  No
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      {/* <RedirectingModal
        info={loader.info}
        moreInfo={loader.moreInfo}
        subInfo={loader.subInfo}
        opened={loader.status}
        setModal={(type: any) => setLoader({ ...loader, status: type })}
      /> */}
    </Box>
  );
}
