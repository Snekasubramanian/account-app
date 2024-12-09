import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { useFormikContext } from 'formik';
import "@fontsource/inter";

export default function SubmitButton({
  label = 'Confirm',
  disabled = true,
  ...props
}: LoadingButtonProps & { label: string, disabled: Boolean }): JSX.Element {
  const formikContext = useFormikContext();

  return (
    <LoadingButton
      sx={{
        margin: 'auto',
        mb: 0,
        backgroundColor: '#6637E4',
        color: 'white',
        width: '100%',
        height: '56px',
        fontFamily: 'Inter',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '100%',
        borderRadius: '12px',
        '&:hover': {
          backgroundColor: '#6637E4',
          // boxShadow: 'inset 0px 1px 0px 0px #846FC0'
          borderTop: '1px solid rgba(255, 255, 255, 0.20)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
          borderRight: '1px solid rgba(255, 255, 255, 0.20)',
        },
        textTransform: 'none',
        // boxShadow: 'inset 0px 1px 0px 0px #846FC0',
        borderTop: '1px solid rgba(255, 255, 255, 0.20)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
        borderRight: '1px solid rgba(255, 255, 255, 0.20)',
        '&:disabled': {
          opacity: '50%',
          color: '#FFF',
        },
      }}
      type="submit"
      fullWidth
      disabled={disabled}
      {...props}
    >
      {label}
    </LoadingButton>
  );
}
