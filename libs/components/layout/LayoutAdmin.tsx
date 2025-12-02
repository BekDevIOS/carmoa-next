import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MenuList from '../admin/AdminMenuList';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Menu, MenuItem } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { LightMode, DarkMode, NotificationsOutlined } from '@mui/icons-material';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar, themeVar } from '../../../apollo/store';
import { getMemberImageUrl } from '../../config';
import { MemberType } from '../../enums/member.enum';
const drawerWidth = 280;

const withAdminLayout = (Component: ComponentType) => {
	return (props: object) => {
		const router = useRouter();
		const user = useReactiveVar(userVar);
		const themeMode = useReactiveVar(themeVar);
		const [settingsState, setSettingsStateState] = useState(false);
		const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
		const [openMenu, setOpenMenu] = useState(false);
		const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
		const [title, setTitle] = useState('admin');
		const [loading, setLoading] = useState(true);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			setLoading(false);
		}, []);

		useEffect(() => {
			if (!loading && user.memberType !== MemberType.ADMIN) {
				router.push('/').then();
			}
		}, [loading, user, router]);

		/** HANDLERS **/
		const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorElUser(event.currentTarget);
		};

		const handleCloseUserMenu = () => {
			setAnchorElUser(null);
		};

		const logoutHandler = () => {
			logOut();
			router.push('/').then();
		};

		const handleThemeToggle = () => {
			const newMode = themeMode === 'light' ? 'dark' : 'light';
			themeVar(newMode);
		};

		if (!user || user?.memberType !== MemberType.ADMIN) return null;

		return (
			<main id="pc-wrap" className="admin">
				<Box component={'div'} sx={{ display: 'flex' }}>
					<AppBar
						position="fixed"
						sx={{
							width: `calc(100% - ${drawerWidth}px)`,
							ml: `${drawerWidth}px`,
							boxShadow: 'rgb(100 116 139 / 12%) 0px 1px 4px',
							background: 'none',
						}}
					>
						<Toolbar>
							<Tooltip title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
								<IconButton
									onClick={handleThemeToggle}
									sx={{ 
										mr: 1,
										color: 'text.primary'
									}}
									size="small"
								>
									{themeMode === 'light' ? <DarkMode /> : <LightMode />}
								</IconButton>
							</Tooltip>
							<Tooltip title="Notifications">
								<IconButton
									onClick={() => router.push('/_admin/cs/notice')}
									sx={{ 
										mr: 1,
										color: 'text.primary',
										position: 'relative'
									}}
									size="small"
								>
									<NotificationsOutlined />
									{/* Optional: Add notification badge for unread count */}
									{/* <Box
										component={'span'}
										sx={{
											position: 'absolute',
											top: 8,
											right: 8,
											width: 8,
											height: 8,
											bgcolor: 'error.main',
											borderRadius: '50%',
										}}
									/> */}
								</IconButton>
							</Tooltip>
							<Tooltip title="Open settings">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar
										src={getMemberImageUrl(user?.memberImage)}
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-appbar"
								className={'pop-menu'}
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<Box
									component={'div'}
									onClick={handleCloseUserMenu}
									sx={{
										width: '200px',
									}}
								>
									<Stack sx={{ px: '20px', my: '12px' }}>
										<Typography variant={'h6'} component={'h6'} sx={{ mb: '4px' }}>
											{user?.memberNick}
										</Typography>
										<Typography variant={'subtitle1'} component={'p'} sx={{ color: 'text.secondary' }}>
											{user?.memberPhone}
										</Typography>
									</Stack>
									<Divider />
									<Box component={'div'} sx={{ p: 1, py: '6px' }} onClick={logoutHandler}>
										<MenuItem sx={{ px: '16px', py: '6px' }}>
											<Typography variant={'subtitle1'} component={'span'}>
												Logout
											</Typography>
										</MenuItem>
									</Box>
								</Box>
							</Menu>
						</Toolbar>
					</AppBar>

					<Drawer
						sx={{
							width: drawerWidth,
							flexShrink: 0,
							'& .MuiDrawer-paper': {
								width: drawerWidth,
								boxSizing: 'border-box',
							},
						}}
						variant="permanent"
						anchor="left"
						className="aside"
					>
						<Toolbar sx={{ flexDirection: 'column', alignItems: 'flexStart' }}>
							<Stack className={'logo-box'}>
								<img src={'/img/logo/favicon.png'} alt={'logo'} />
							</Stack>

							<Stack
								className="user"
								direction={'row'}
								alignItems={'center'}
								sx={{
									bgcolor: openMenu ? 'rgba(255, 255, 255, 0.04)' : 'none',
									borderRadius: '8px',
									px: '24px',
									py: '11px',
								}}
							>
								<Avatar
									src={getMemberImageUrl(user?.memberImage)}
								/>
								<Typography variant={'body2'} p={1} ml={1}>
									{user?.memberNick} <br />
									{user?.memberPhone}
								</Typography>
							</Stack>
						</Toolbar>

						<Divider />

						<MenuList />
					</Drawer>

					<Box component={'div'} id="bunker" sx={{ flexGrow: 1 }}>
						{/*@ts-ignore*/}
						<Component {...props} setSnackbar={setSnackbar} setTitle={setTitle} />
					</Box>
				</Box>
			</main>
		);
	};
};

export default withAdminLayout;
