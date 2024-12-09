import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import * as React from 'react';

export default function DrawerWrapper({
  children,
  open = true,
  setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
}) {
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(open);
    };

  return (
    // zindex more than a modal
    <Drawer
      anchor="bottom"
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
      onClose={toggleDrawer(false)}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 40,
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
}
