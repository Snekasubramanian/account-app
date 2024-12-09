import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

export const drawerWidth = 240;

function MenuItem({ text, url }: { text: string; url: string }) {
  const navigate = useNavigate();
  function handleOnClick() {
    navigate(url);
  }
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleOnClick} sx={{ color: 'white' }}>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}

export default function LoggedInUserLayout() {
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            position: 'fixed',
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'primary.main',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          <MenuItem text="Dashboard" url="/" />
          <MenuItem text="Account Management" url="/accounts" />
          <MenuItem text="Group Management" url="/groups" />
          <MenuItem text="Excursions" url="/excursions" />
        </List>
      </Drawer>
      <Box style={{ paddingLeft: drawerWidth }}>
        <Outlet />
      </Box>
    </>
  );
}
