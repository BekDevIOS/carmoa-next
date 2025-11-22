import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

/**
 * =====================
 *   CARMOA LIGHT THEME
 * =====================
 */
export const light = {
  palette: {
    mode: 'light',

    background: {
      default: '#FFFFFF',   // Clean white layout
      paper: '#FFFFFF',
    },

    primary: {
      main: '#FFB800',      // CarMoa Yellow
      dark: '#E0A300',      // Hover yellow
      light: '#FFF1CC',     // Soft yellow background
      contrastText: '#1A1A1A',
    },

    secondary: {
      main: '#1A1A1A',
      contrastText: '#FFFFFF',
    },

    text: {
      primary: '#1A1A1A',
      secondary: '#555555',
      disabled: '#A0A0A0',
    },

    divider: '#E5E5E5',
  },

  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '0',
          color: '#1A1A1A',
        },
      },
      defaultProps: {
        variantMapping: {
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitle1: 'p',
          subtitle2: 'p',
          body1: 'p',
          body2: 'p',
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          fontFamily: "'Inter', 'Roboto', sans-serif",
        },
        a: {
          color: '#FFB800',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: '#FFB800',
          '&:hover': { textDecoration: 'underline' },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E5E5E5',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',   // CarMoa soft shadow
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'none',
          lineHeight: 1.2,
        },

        containedPrimary: {
          backgroundColor: '#FFB800',
          color: '#1A1A1A',
          '&:hover': {
            backgroundColor: '#E0A300',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },

        outlinedPrimary: {
          borderColor: '#FFB800',
          color: '#FFB800',
          '&:hover': {
            backgroundColor: '#FFF1CC',
            borderColor: '#E0A300',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E2E2',
          backgroundColor: '#FFFFFF',
          color: '#333333',
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          width: 44,
          height: 44,
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          boxShadow: '0 4px 12px rgba(0,0,0,0.14)',
          '&:hover': {
            backgroundColor: '#FFF1CC',
          },
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-checked': {
            color: '#FFB800',
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 44,
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
        },
        notchedOutline: {
          border: '1px solid #E2E2E2',
        },
        input: {
          padding: '10px 12px',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '8px 14px',
          '&:hover': {
            backgroundColor: '#FFF1CC',
          },
        },
      },
    },
  },

  shadow,
  typography,
};


/**
 * =====================
 *   CARMOA DARK THEME
 * =====================
 */
export const dark = {
  palette: {
    mode: 'dark',

    background: {
      default: '#121212',  // Soft dark mode
      paper: '#1A1A1A',
    },

    primary: {
      main: '#FFB800',
      dark: '#E0A300',
      light: '#FFD766',
      contrastText: '#1A1A1A',
    },

    secondary: {
      main: '#FFFFFF',
      contrastText: '#000',
    },

    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      disabled: '#777777',
    },

    divider: 'rgba(255,255,255,0.12)',
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { height: '100%' },
        body: {
          backgroundColor: '#121212',
          color: '#FFFFFF',
          fontFamily: "'Inter', 'Roboto', sans-serif",
        },
        a: {
          color: '#FFB800',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.55)', // soft automotive dark shadow
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: '#FFB800',
          color: '#1A1A1A',
          '&:hover': {
            backgroundColor: '#E0A300',
          },
        },
        outlinedPrimary: {
          borderColor: '#FFB800',
          color: '#FFB800',
          '&:hover': { backgroundColor: '#26272F' },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.12)',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #2D2D2D',
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          width: 44,
          height: 44,
          backgroundColor: '#1E1E1E',
          color: '#FFFFFF',
          boxShadow: '0 6px 18px rgba(0,0,0,0.7)',
          '&:hover': {
            backgroundColor: '#262626',
          },
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#BDBDBD',
          '&.Mui-checked': {
            color: '#FFB800',
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 44,
          width: '100%',
          backgroundColor: '#131313',
          color: '#FFFFFF',
          borderRadius: 8,
        },
        notchedOutline: {
          border: '1px solid #333843',
        },
        input: {
          padding: '10px 12px',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          padding: '6px 10px',
          '&:hover': {
            backgroundColor: '#252733',
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: '#20222B',
          color: '#FFFFFF',
        },
      },
    },
  },

  shadow,
  typography,
};
