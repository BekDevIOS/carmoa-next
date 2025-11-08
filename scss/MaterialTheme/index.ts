import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

/**
 * LIGHT THEME (DEFAULT)
 */
export const light = {
	palette: {
		mode: 'light',
		background: {
			default: '#FFFFFF',
			paper: common.white,
		},
		primary: {
			main: '#F4A51C', // orange accent
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#333333', // dark gray for contrast
			contrastText: '#FFFFFF',
		},
		text: {
			primary: '#222222', // main text
			secondary: '#555555', // muted gray
			disabled: '#999999',
			dark: common.black,
		},
		divider: '#E5E5E5',
	},
	components: {
		MuiTypography: {
			styleOverrides: {
				root: {
					letterSpacing: '0',
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
					subtitle3: 'p',
					body1: 'p',
					body2: 'p',
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					color: '#F4A51C',
					textDecoration: 'none',
					'&:hover': {
						textDecoration: 'underline',
					},
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
		MuiCssBaseline: {
			styleOverrides: {
				html: { height: '100%' },
				body: {
					background: '#FFFFFF',
					color: '#222222',
					height: '100%',
					minHeight: '100%',
					fontFamily: "'Inter', 'Roboto', sans-serif",
				},
				p: {
					margin: '0',
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
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: '4px',
					fontWeight: 500,
					textTransform: 'none',
					boxShadow: 'none',
					minWidth: 'auto',
					lineHeight: '1.2',
					'&.MuiButton-containedPrimary': {
						backgroundColor: '#F4A51C',
						color: '#FFFFFF',
						'&:hover': {
							backgroundColor: '#e09918',
						},
					},
					'&.MuiButton-outlinedPrimary': {
						borderColor: '#F4A51C',
						color: '#F4A51C',
						'&:hover': {
							backgroundColor: '#FFF7E5',
						},
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: '#FFFFFF',
					boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
					borderRadius: '6px',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					border: '1px solid #ddd',
					color: '#222222',
					backgroundColor: '#FFFFFF',
				},
			},
		},
		MuiFab: {
			styleOverrides: {
				root: {
					width: '40px',
					height: '40px',
					background: '#FFFFFF',
					color: '#222222',
					boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
					'&:hover': {
						background: '#FFF7E5',
					},
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: '#999999',
					'&.Mui-checked': {
						color: '#F4A51C',
					},
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				select: {
					textAlign: 'left',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					height: '48px',
					width: '100%',
					backgroundColor: '#fff',
					borderRadius: '4px',
				},
				notchedOutline: {
					border: '1px solid #E5E5E5',
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					margin: '5px 0 0 2px',
					lineHeight: '1.2',
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					padding: '6px 8px',
					'&:hover': {
						backgroundColor: '#FFF7E5',
					},
				},
			},
		},
	},
	shadow,
	typography,
};
