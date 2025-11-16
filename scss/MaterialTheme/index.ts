import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

/**
 * LIGHT THEME 
 */
export const light = {
  palette: {
    mode: 'light',

    // Cartop uses completely white background (not grey)
    background: {
      default: '#f5f5f5',
      paper: common.white,
    },

    // Updated to match Cartop orange more closely
    primary: {
      main: '#FCB800',          // Cartop's orange
      dark: '#E5A000',          // Hover orange
      light: '#FFF7D6',         // Outline hover background
      contrastText: '#1A1A1A',  // Cartop uses BLACK TEXT inside yellow buttons
    },

    // Black icons / text
    secondary: {
      main: '#1A1A1A',
      contrastText: '#FFFFFF',
    },

    text: {
      primary: '#1A1A1A',       // Pure black
      secondary: '#666666',
      disabled: '#A0A0A0',
    },

    divider: '#E5E5E5',         // Cartop thin grey line
  },

  components: {
    // Typography stays clean
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '0',
          color: '#1A1A1A', // global text color
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

    // Global baseline
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          fontFamily: "'Inter', 'Roboto', sans-serif",
        },
        a: {
          color: '#FCB800',
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
          color: '#FCB800',
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

    // Product cards, dropdown panels, white blocks
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', // Cartop soft shadow
        },
      },
    },

    // Buttons (Cartop style)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          textTransform: 'none',
          lineHeight: 1.2,
        },

        containedPrimary: {
          backgroundColor: '#FCB800',
          color: '#1A1A1A', // Cartop black text inside yellow button
          '&:hover': {
            backgroundColor: '#E5A000',
            boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
          },
        },

        outlinedPrimary: {
          borderColor: '#FCB800',
          color: '#FCB800',
          '&:hover': {
            backgroundColor: '#FFF7D6',
            borderColor: '#E5A000',
          },
        },
      },
    },

    // Rounded gray chips (filter tags)
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

    // Floating chat buttons etc.
    MuiFab: {
      styleOverrides: {
        root: {
          width: 44,
          height: 44,
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          boxShadow: '0 4px 12px rgba(0,0,0,0.14)',
          '&:hover': {
            backgroundColor: '#FFF7D6',
          },
        },
      },
    },

    // Checkboxes
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&.Mui-checked': {
            color: '#FCB800',
          },
        },
      },
    },

    // Inputs
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 44,
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 6,
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
            backgroundColor: '#FFF7D6',
          },
        },
      },
    },
  },

  shadow,
  typography,
};


/**
 * DARK THEME
 */
export const dark = {
  palette: {
    mode: 'dark',
    background: {
      default: '#050608',
      paper: '#14151A',
    },
    primary: {
      main: '#F4A51C',
      contrastText: '#0D0D0D',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#0D0D0D',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#B8B8B8',
      disabled: '#777777',
    },
    divider: '#292B32',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { height: '100%' },
        body: {
          backgroundColor: '#050608',
          color: '#F5F5F5',
          fontFamily: "'Inter', 'Roboto', sans-serif",
        },
        a: {
          color: '#F4A51C',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#F5F5F5',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#14151A',
          color: '#FFFFFF',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.65)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: '#F4A51C',
          color: '#14151A',
          '&:hover': {
            backgroundColor: '#E09918',
          },
        },
        outlinedPrimary: {
          borderColor: '#F4A51C',
          color: '#F4A51C',
          '&:hover': {
            backgroundColor: '#26272F',
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#292B32',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #333843',
          backgroundColor: '#14151A',
          color: '#F5F5F5',
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          width: 44,
          height: 44,
          backgroundColor: '#1D1E25',
          color: '#FFFFFF',
          boxShadow: '0 6px 18px rgba(0,0,0,0.7)',
          '&:hover': {
            backgroundColor: '#252733',
          },
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#BDBDBD',
          '&.Mui-checked': {
            color: '#F4A51C',
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 44,
          width: '100%',
          backgroundColor: '#13141A',
          color: '#F5F5F5',
          borderRadius: 6,
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
          color: '#F5F5F5',
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
          color: '#F5F5F5',
        },
      },
    },
  },
  shadow,
  typography,
};
