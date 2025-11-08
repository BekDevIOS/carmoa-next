import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Stack, Box, Button, MenuItem } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import { ExpandMore as ExpandMoreIcon, LocationOn as LocationOnIcon } from '@mui/icons-material';
import Link from 'next/link';

const TopBar = () => {
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
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
			<Stack className={'container'}>
				<Box component={'div'} className={'left-section'}>
					<Box component={'span'} className={'shipping-text'} sx={{ color: 'text.primary' }}>
						Free Shipping On Order Over $99
					</Box>
					<Box component={'div'} className={'store-location'}>
						<Box component={'span'} sx={{ color: 'text.primary' }}>
							Store Locations
						</Box>
						<LocationOnIcon sx={{ color: 'text.primary', fontSize: 20 }} />
					</Box>
				</Box>
				<Box component={'div'} className={'right-section'}>
					<Box component={'div'} className={'nav-links'}>
						<Link href={'/about'}>
							<Box component={'span'} sx={{ color: 'text.primary' }}>About Us</Box>
						</Link>
						<Link href={'/mypage'}>
							<Box component={'span'} sx={{ color: 'text.primary' }}>My account</Box>
						</Link>
						<Link href={'/order-tracking'}>
							<Box component={'span'} sx={{ color: 'text.primary' }}>Order Tracking</Box>
						</Link>
						<Link href={'/partnership'}>
							<Box component={'span'} sx={{ color: 'text.primary' }}>Partnership</Box>
						</Link>
					</Box>
					<Box component={'div'} className={'divider'} sx={{ bgcolor: 'text.primary' }} />
					<Box component={'div'} className={'selector-tabs'}>
						<Box component={'div'} className={'tab-item'}>
							<Button
								disableRipple
								className="tab-btn"
								onClick={langClick}
								endIcon={<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />}
							>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									ENG
								</Box>
							</Button>
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
						</Box>
						<Box component={'div'} className={'tab-item'}>
							<Button
								disableRipple
								className="tab-btn"
								endIcon={<ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 12 }} />}
							>
								<Box component={'span'} sx={{ color: 'text.primary' }}>
									$ USD
								</Box>
							</Button>
						</Box>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default TopBar;