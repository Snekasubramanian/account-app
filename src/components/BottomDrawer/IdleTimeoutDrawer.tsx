import { Box, CardMedia, Typography } from '@mui/material';

import DrawerWrapper from './DrawerWrapper';

export default function IdleTimeoutDrawer({
  idleDrawer,
  setIdleDrawer,
}: {
  idleDrawer: boolean;
  // eslint-disable-next-line no-unused-vars
  setIdleDrawer: (value: boolean) => void;
}) {
  return (
    <DrawerWrapper open={idleDrawer} setOpen={setIdleDrawer}>
      <Box sx={{ mx: 5, mt: 8, mb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CardMedia
            component="img"
            image="/images/idle.png"
            sx={{
              maxHeight: 150,
              width: 'unset',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 1,
            fontSize: 16,
          }}
        >
          <Typography
            sx={{
              color: 'text.dark',
              fontWeight: 600,
              pb: 2.5,
            }}
          >
            You have been inactive for a while!
          </Typography>
          <Typography>
            Please follow onscreen prompt to continue with account linking process.
          </Typography>
        </Box>
      </Box>
    </DrawerWrapper>
  );
}
