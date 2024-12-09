import {
  Box,
  Card,
  CardMedia,
  Checkbox,
  Radio,
  Grid,
  SvgIcon,
  SvgIconProps,
  Typography,
} from '@mui/material';

import { IMAGE_BASE_URL } from '../../api/urls';

export function CheckboxUncheckedIcon(props: SvgIconProps) {
  return (
    // <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    //   <g clip-path="url(#clip0_1202_4248)">
    //     <rect x="1.2435" y="1.24301" width="17.5133" height="17.5133" rx="3.75667" stroke="#EEEAFF" stroke-width="0.82" />
    //   </g>
    //   <defs>
    //     <clipPath id="clip0_1202_4248">
    //       <rect width="20" height="20" fill="white" />
    //     </clipPath>
    //   </defs>
    // </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <circle cx="10" cy="10" r="9" stroke="#D5CDF2" stroke-width="2"/>
</svg>
  );
}

export function CheckboxCheckedIcon(props: SvgIconProps) {
  return (
    // <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    //   <g clip-path="url(#clip0_1202_3957)">
    //     <rect x="0.833374" y="0.833008" width="18.3333" height="18.3333" rx="4.16667" fill="#1EA787" />
    //     <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0732 7.37773L9.79213 12.9984C9.61528 13.2281 9.34201 13.363 9.05208 13.3637C8.76376 13.3653 8.49078 13.234 8.31202 13.0077L6.02629 10.0944C5.70811 9.68565 5.78151 9.09639 6.19023 8.77821C6.59895 8.46003 7.18821 8.53342 7.50639 8.94214L9.03333 10.8906L12.5743 6.20676C12.8899 5.79287 13.4813 5.71318 13.8952 6.02877C14.3091 6.34436 14.3888 6.93573 14.0732 7.34962L14.0732 7.37773Z" fill="white" />
    //   </g>
    //   <defs>
    //     <clipPath id="clip0_1202_3957">
    //       <rect width="20" height="20" fill="white" />
    //     </clipPath>
    //   </defs>
    // </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <circle cx="10" cy="10" r="9" stroke="#D5CDF2" stroke-width="2"/>
  <circle cx="10" cy="10" r="5" fill="#C5B0FF"/>
</svg>
  );
}

export default function BankSelectionCheckbox({
  logo,
  bankName,
  accountNo,
  accountType = 'savings',
  checked,
  linked = false,
  onChange,
}: {
  logo: string;
  bankName: string;
  accountNo: string;
  accountType?: string;
  checked?: boolean;
  linked?: boolean;
  onChange?: any;
}) {
  return (
    <Box
      sx={{
        boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#fff',
        borderRadius: '3px',
        padding: '15px 10px',
        marginBottom: '20px',
      }}
      onClick={() => onChange(!checked)}
    >
      <Grid sx={{ display: 'flex', alignItems: 'center' }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: '72px',
            height: '40px',
            margin: 'auto 0',
            padding: '12px 8px',
            borderRadius: '3px',
            background: '#FFFFFF',
            boxShadow: '0px 0px 1px  rgba(0, 0, 0, 0.25)',
            marginRight: '15px',
          }}
        >
          <CardMedia
            sx={{
              margin: 'auto',
              objectFit: 'contain',
              width: 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            component="img"
            image={IMAGE_BASE_URL + logo}
            alt="logo"
          />
        </Card>
        <Grid sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              fontSize: '16px',
              color: '#333',
              fontWeight: 500,
              marginBottom: '7px',
              lineHeight: '18px',
            }}
          >
            {bankName}{' '}
            {linked && (
              <span
                style={{
                  fontSize: '14px',
                  color: '#00A859',
                  fontWeight: 400,
                  display: 'inline-block',
                }}
              >
                {' '}
                (Already linked)
              </span>
            )}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#666',
              fontWeight: 400,
              marginBottom: 0,
              lineHeight: '16px',
            }}
          >
            {accountType === 'SAVINGS' ? 'Savings ' : 'Current '} Acc. - {accountNo}
          </Typography>
        </Grid>
        <Grid>
          {/* <Checkbox
            icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            checked={checked}
            color="primary"
          /> */}
          <Radio
            checked={checked}
            color="primary" 
            name="radio-buttons"
             icon={<CheckboxUncheckedIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
