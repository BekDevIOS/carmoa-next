import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Stack, Box, MenuItem, Typography, IconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import { ExpandMore as ExpandMoreIcon, LightMode as LightModeIcon, DarkMode as DarkModeIcon, HeadsetMic as HeadsetMicIcon } from '@mui/icons-material';

const TopBar = () => {
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
	const drop = Boolean(anchorEl2);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
		const savedThemeMode = localStorage.getItem('themeMode');
		if (savedThemeMode === 'light' || savedThemeMode === 'dark') {
			setThemeMode(savedThemeMode);
		}
	}, [router]);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const handleThemeToggle = () => {
		const newMode = themeMode === 'light' ? 'dark' : 'light';
		setThemeMode(newMode);
		localStorage.setItem('themeMode', newMode);
		// Hardcoded theme toggle - can be connected to actual theme switching later
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));


	return (
		<Stack className={'utility-bar'} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
			<Stack className={'container'} direction="row" justifyContent="space-between" alignItems="center">
				<Box component={'div'} className={'left-section'}>
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						🚚 Free Shipping On Orders Over $99
					</Typography>
				</Box>
				<Box component={'div'} className={'right-section'} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography
						variant="body2"
						onClick={langClick}
						sx={{
							color: 'text.primary',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
						}}
					>
						ENG <ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />
					</Typography>
					<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
						<MenuItem disableRipple onClick={langChoice} id="en">
							<img
								className="img-flag"
								src={'/img/flag/langen.png'}
								onClick={langChoice}
								id="en"
								alt={'usaFlag'}
							/>
							{t('English')}
						</MenuItem>
						<MenuItem disableRipple onClick={langChoice} id="kr">
							<img
								className="img-flag"
								src={'/img/flag/langkr.png'}
								onClick={langChoice}
								id="kr"
								alt={'koreanFlag'}
							/>
							{t('Korean')}
						</MenuItem>
						<MenuItem disableRipple onClick={langChoice} id="ru">
							<img
								className="img-flag"
								src={'/img/flag/langru.png'}
								onClick={langChoice}
								id="ru"
								alt={'russiaFlag'}
							/>
							{t('Russian')}
						</MenuItem>
					</StyledMenu>
					<IconButton onClick={handleThemeToggle} sx={{ color: 'text.primary', padding: '4px' }} size="small">
						{themeMode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
					</IconButton>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							color: 'text.secondary',
						}}
					>
						<HeadsetMicIcon sx={{ fontSize: 16 }} />
						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
							(+8210 5700 4474)
						</Typography>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default TopBar;