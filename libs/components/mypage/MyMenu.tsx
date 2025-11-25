import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, useTheme } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import PortraitIcon from '@mui/icons-material/Portrait';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOn from '@mui/icons-material/LocationOn';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PhoneIcon from '@mui/icons-material/Phone';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert, sweetMixinErrorAlert } from '../../sweetAlert';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const theme = useTheme();
	const pathname = router.query.category ?? 'myProfile';
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);
	user.memberType = 'DEALER';

	// Helper function to get icon color based on active state
	const getIconColor = (isActive: boolean) => {
		if (isActive) {
			return '#ffffff'; // White for active state in both modes
		}
		return theme.palette.text.primary; // Theme-aware text color for inactive state
	};

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	if (device === 'mobile') {
		return <div>MY MENU</div>;
	} else {
		return (
			<Stack width={'100%'} padding={'30px 24px'}>
				<Stack className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name'}>{user?.memberNick}</Typography>
						<Box component={'div'} className={'user-phone'}>
							<PhoneIcon sx={{ fontSize: 16, color: theme.palette.text.primary }} />
							<Typography className={'p-number'}>{user?.memberPhone}</Typography>
						</Box>
						{user?.memberType === 'ADMIN' ? (
							<a href="/_admin/users" target={'_blank'}>
								<Typography className={'view-list'}>{user?.memberType}</Typography>
							</a>
						) : (
							<Typography className={'view-list'}>{user?.memberType}</Typography>
						)}
					</Stack>
				</Stack>
				<Stack className={'sections'}>
					<Stack className={'section'} style={{ height: user.memberType === 'DEALER' ? '270px' : '195px' }}>
						<Typography className="title" variant={'h5'}>
							My Activity
						</Typography>
						<List className={'sub-section'}>
							{user.memberType === 'DEALER' && (
								<>
									<ListItem className={pathname === 'addProduct' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/mypage',
												query: { category: 'addProduct' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												<AddIcon
													className={'com-icon'}
													sx={{
														fontSize: 16,
														color: getIconColor(category === 'addProduct'),
													}}
												/>
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													Add Product
												</Typography>
												<IconButton aria-label="delete" sx={{ ml: '36px' }}>
													<PortraitIcon style={{ color: 'red' }} />
												</IconButton>
											</div>
										</Link>
									</ListItem>
									<ListItem className={pathname === 'myProducts' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/mypage',
												query: { category: 'myProducts' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												<InventoryIcon
													className={'com-icon'}
													sx={{
														fontSize: 16,
														color: getIconColor(category === 'myProducts'),
													}}
												/>
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													My Products
												</Typography>
												<IconButton aria-label="delete" sx={{ ml: '36px' }}>
													<PortraitIcon style={{ color: 'red' }} />
												</IconButton>
											</div>
										</Link>
									</ListItem>
								</>
							)}
							<ListItem className={pathname === 'orders' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'orders' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<ShoppingCartIcon
											className={'com-icon'}
											sx={{
												fontSize: 16,
												color: getIconColor(category === 'orders'),
											}}
										/>

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Orders
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'myFavorites' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myFavorites' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										{category === 'myFavorites' ? (
											<FavoriteIcon
												className={'com-icon'}
												sx={{
													fontSize: 16,
													color: getIconColor(true),
												}}
											/>
										) : (
											<FavoriteBorderIcon
												className={'com-icon'}
												sx={{
													fontSize: 16,
													color: getIconColor(false),
												}}
											/>
										)}

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Favorites
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'recentlyVisited' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'recentlyVisited' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<HistoryIcon
											className={'com-icon'}
											sx={{
												fontSize: 16,
												color: getIconColor(category === 'recentlyVisited'),
											}}
										/>

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Recently Visited
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'followers' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'followers' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PeopleIcon
											className={'com-icon'}
											sx={{
												fontSize: 16,
												color: getIconColor(category === 'followers'),
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Followers
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'followings' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'followings' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PersonAddIcon
											className={'com-icon'}
											sx={{
												fontSize: 16,
												color: getIconColor(category === 'followings'),
											}}
										/>

										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Followings
										</Typography>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>
					<Stack className={'section'} sx={{ marginTop: '10px' }}>
						<div>
							<Typography className="title" variant={'h5'}>
								Blog
							</Typography>
							<List className={'sub-section'}>
								<ListItem className={pathname === 'myArticles' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/mypage',
											query: { category: 'myArticles' },
										}}
										scroll={false}
									>
										<div className={'flex-box'}>
											<ArticleIcon
												className={'com-icon'}
												sx={{
													fontSize: 16,
													color: getIconColor(category === 'myArticles'),
												}}
											/>

											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Articles
											</Typography>
										</div>
									</Link>
								</ListItem>
								<ListItem className={pathname === 'writeArticle' ? 'focus' : ''}>
									<Link
										href={{
											pathname: '/mypage',
											query: { category: 'writeArticle' },
										}}
										scroll={false}
									>
										<div className={'flex-box'}>
											<EditIcon
												className={'com-icon'}
												sx={{
													fontSize: 16,
													color: getIconColor(category === 'writeArticle'),
												}}
											/>
											<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
												Write Article
											</Typography>
										</div>
									</Link>
								</ListItem>
							</List>
						</div>
					</Stack>
					<Stack className={'section'} sx={{ marginTop: '30px' }}>
						<Typography className="title" variant={'h5'}>
							Account Settings
						</Typography>
						<List className={'sub-section'}>
							<ListItem className={pathname === 'myProfile' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myProfile' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PersonIcon
											className={'com-icon'}
											sx={{
												fontSize: 16,
												color: getIconColor(category === 'myProfile'),
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Profile
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'addresses' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'addresses' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<LocationOn
											className={'com-icon'}
											sx={{
												fontSize: 16,
												color: getIconColor(category === 'addresses'),
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Addresses
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem onClick={logoutHandler}>
								<div className={'flex-box'}>
									<LogoutIcon
										className={'com-icon'}
										sx={{
											fontSize: 16,
											color: theme.palette.text.primary,
										}}
									/>
									<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
										Logout
									</Typography>
								</div>
							</ListItem>
						</List>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MyMenu;
