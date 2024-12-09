import { Button, ButtonProps, CardMedia, Grid, Typography } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { Box } from '@mui/system';
import "@fontsource/inter";

const Item = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontSize: 36,
  [theme.breakpoints.up('sm')]: {
    fontSize: 48,
  },
  color: theme.palette.common.white,
}));

export const LoginParagraph = styled(Typography)({
  fontFamily: "Inter",
  fontSize: 16,
  color: '#333333',
  marginBottom: 8,
  lineHeight: '22px',
  fontWeight: 500,
});

export const LoginLogo = (): JSX.Element => {
  return (
    <Grid container item direction="column" justifyContent="center">
      <Grid item container xs="auto" direction="column">
        <Item>
          <CardMedia
            sx={{
              maxHeight: 34,
              objectFit: 'unset',
              width: 'auto',
              margin: 'auto',
              mb: 4,
            }}
            component="img"
            image="/images/logo.svg"
            alt="logo"
          />
        </Item>
      </Grid>
    </Grid>
  );
};

export const LoginBanner = (): JSX.Element => {
  return (
    <Grid container item direction="column" justifyContent="center">
      <Grid item container xs="auto" direction="column">
        <Item>
          <CardMedia
            sx={{
              objectFit: 'unset',
              maxWidth: 250,
              margin: 'auto',
              mb: 2,
            }}
            component="img"
            image="/images/login-banner.svg"
            alt="logo"
          />
        </Item>
      </Grid>
    </Grid>
  );
};

export function PoweredBy() {
  return (
    <Box sx={{ background: '#fff', textAlign: 'center', padding: '5px', width: '100%' }}>
      <Typography
        sx={{ fontSize: 12, color: '#333', fontWeight: 500, display: 'inline-flex' }}
      >
        Powered by &nbsp;
        <img src="/images/cams-finserv.svg" alt="icon" />
      </Typography>
    </Box>
  );
}

export function CustomHeading({ info, style }: { info: string; style?: any }) {
  return (
    <Typography
      variant="h6"
      sx={{ color: 'primary.main', fontSize: 18, fontWeight: 500 }}
      style={style}
    >
      {info}
    </Typography>
  );
}

export function CustomButton({
  label = 'submit',
  variant = 'contained',
  ...props
}: ButtonProps & { label: string }) {
  return (
    <Button
      variant={variant}
      {...props}
      sx={{
        borderRadius: '3px',
        display: 'block',
        margin: 'auto',
        padding: '10px 16px',
        color: '#fff',
        boxShadow: 'none',
        marginBottom: '10px',
        textTransform: 'unset',
        fontSize: '18px',
        fontWeight: 700,
        textAlign: 'center',
      }}
    >
      {label}
    </Button>
  );
}

export function CustomBorderedButton({
  label = 'submit',
  ...props
}: ButtonProps & { label: string }) {
  return (
    <Button
      {...props}
      sx={{
        background: '#fff',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'primary.main',
        borderRadius: '3px',
        display: 'block',
        width: '100%',
        maxWidth: '500px',
        margin: 'auto',
        padding: '10px 16px',
        color: 'primary.main',
        boxShadow: 'none',
        marginBottom: '10px',
        textTransform: 'unset',
        fontSize: '16px',
        fontWeight: 400,
        textAlign: 'center',
        '&:hover': {
          background: '#fff',
        },
      }}
    >
      {label}
    </Button>
  );
}
