import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

/**
 * DARK THEME 
 */
export const dark = {
	palette: {
		mode: 'dark',
		background: {
			default: '#0D0D0D', 
			paper: '#1A1A1A', 
		},
		primary: {
			main: '#F4A51C', 
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#FFFFFF', 
			contrastText: '#0D0D0D',
		},
		text: {
			primary: '#F5F5F5', 
			secondary: '#BDBDBD', 
			disabled: '#777777',
		},
		divider: '#333333',
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				html: { height: '100%' },
				body: {
					background: '#0D0D0D',
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
					backgroundColor: '#1A1A1A',
					color: '#FFFFFF',
					boxShadow: '0 2px 10px rgba(0,0,0,0.6)',
					borderRadius: '6px',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: '4px',
					fontWeight: 500,
					textTransform: 'none',
					boxShadow: 'none',
					'&.MuiButton-containedPrimary': {
						backgroundColor: '#F4A51C',
						color: '#0D0D0D',
						'&:hover': {
							backgroundColor: '#e09918',
						},
					},
					'&.MuiButton-outlinedPrimary': {
						borderColor: '#F4A51C',
						color: '#F4A51C',
						'&:hover': {
							backgroundColor: '#2A2A2A',
						},
					},
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: '#333333',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					border: '1px solid #333',
					backgroundColor: '#1A1A1A',
					color: '#FFFFFF',
				},
			},
		},
		MuiFab: {
			styleOverrides: {
				root: {
					width: '40px',
					height: '40px',
					background: '#222222',
					color: '#FFFFFF',
					boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
					'&:hover': {
						background: '#2D2D2D',
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
					height: '48px',
					width: '100%',
					backgroundColor: '#1A1A1A',
					color: '#F5F5F5',
					borderRadius: '4px',
				},
				notchedOutline: {
					border: '1px solid #333333',
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					color: '#F5F5F5',
					padding: '6px 8px',
					'&:hover': {
						backgroundColor: '#2D2D2D',
					},
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					backgroundColor: '#222',
					color: '#F5F5F5',
				},
			},
		},
	},
	shadow,
	typography,
};
