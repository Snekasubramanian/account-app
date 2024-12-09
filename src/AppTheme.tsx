import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useMemo, useState } from 'react';

import { ColorSchemeStringType } from './api/login';

const AppThemeContext = createContext({
  // eslint-disable-next-line no-unused-vars
  updateColorScheme: (colorScheme: ColorSchemeStringType) => {},
});

export function AppThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeStringType>();
  const colorMode = useMemo(
    () => ({
      updateColorScheme: (_colorScheme: ColorSchemeStringType) => {
        setColorScheme(_colorScheme);
      },
    }),
    [],
  );

  const theme = useMemo(() => {
    const colors = (colorScheme || '#E67817,#FFFFFF').split(',').map((s) => s.trim());
    return createTheme({
      palette: {
        primary: {
          main: colors[0] || '#E67817',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: colors[1] || '#FFFFFF',
        },
        error: {
          main: red.A400,
        },
        text: {
          primary: '#464C53',
          secondary: '#777F88',
          dark: '#020303',
          danger: '#F12D2E',
          active: '#136E64',
          green: '#119F30',
        } as any,
        background: {
          primary: '#F5F5F5',
          active: '#008000',
          disabled: '#D9D9D9',
          secondary: '#F5F8F8',
          warning: '#FFF5EB',
          field: '#EFEFEF',
          orange: '#F1742D1A',
        } as any,
      },
      typography: {
        fontFamily: ['Inter'].join(','),
      },
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              borderRadius: '22px 22px 0 0',
            },
          },
        },
        MuiLoadingButton: {
          defaultProps: {
            disableRipple: true,
            variant: 'contained',
          },
          styleOverrides: {
            root: {
              width: '100%',
              maxWidth: '500px',
              borderRadius: 25,
              boxShadow: 'none',
              textTransform: 'none',
              fontSize: '18px',
              fontWeight: 600,
            },
          },
        },
      } as any,
      transitions: {
        duration: {
          enteringScreen: 500,
          leavingScreen: 350,
        },
      },
    });
  }, [colorScheme]);

  return (
    <AppThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
}

export function useAppThemeContext() {
  return useContext(AppThemeContext);
}
