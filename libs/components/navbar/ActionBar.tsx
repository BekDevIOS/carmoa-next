import React, { useState } from 'react';
import { Stack, Box, MenuItem, Menu, MenuProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
	Menu as MenuIcon,
	ExpandMore as ExpandMoreIcon,
	Search as SearchIcon,
	Tune as TuneIcon,
	PersonOutline as PersonOutlineIcon,
	FavoriteBorder as FavoriteBorderIcon,
	ShoppingCartOutlined as ShoppingCartOutlinedIcon,
} from '@mui/icons-material';

const ActionBar = () => {
	// Mock user state - replace with actual auth context later
	const [user, setUser] = useState<{ isLoggedIn: boolean; role?: string } | null>({ isLoggedIn: true, role: "DEALER" });
	const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
	const profileMenuOpen = Boolean(anchorElProfile);

	const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElProfile(event.currentTarget);
	};

	const handleProfileClose = () => {
		setAnchorElProfile(null);
	};

	const StyledProfileMenu = styled((props: MenuProps) => (
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
			borderRadius: 6,
			marginTop: theme.spacing(0.5),
			minWidth: 200,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				padding: '10px 16px',
				fontSize: 14,
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	return (
		<Stack className={'action-bar'} sx={{ bgcolor: 'primary.main' }}>
			<Stack className={'container'}>
				<Box
					component={'div'}
					className={'shop-departments-btn'}
					sx={{
						bgcolor: 'secondary.main',
						'&:hover': { opacity: 0.9 },
					}}
				>
					<MenuIcon sx={{ color: 'secondary.contrastText', fontSize: 24 }} />
					<Box component={'span'} sx={{ color: 'secondary.contrastText' }}>
						CAR PARTS
					</Box>
					<ExpandMoreIcon sx={{ color: 'secondary.contrastText', fontSize: 16 }} />
				</Box>
				<Box component={'div'} className={'search-section'} sx={{ bgcolor: 'background.paper' }}>
					<input type="text" placeholder="Search for Auto Parts…" className={'search-input'} />
					<Box component={'div'} className={'search-controls'}>
						<Box component={'div'} className={'category-dropdown'}>
							<Box component={'span'} sx={{ color: 'text.secondary' }}>
								All Categories
							</Box>
							<TuneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
						</Box>
						<Box
							component={'div'}
							className={'search-btn'}
							sx={{ bgcolor: 'secondary.main', '&:hover': { opacity: 0.9 } }}
						>
							<SearchIcon sx={{ color: 'secondary.contrastText', fontSize: 24 }} />
						</Box>
					</Box>
				</Box>
				<Box component={'div'} className={'action-icons'}>
					<Box
						component={'div'}
						className={'icon-btn'}
						onClick={handleProfileClick}
						sx={{ cursor: 'pointer' }}
					>
						<PersonOutlineIcon sx={{ color: 'primary.contrastText', fontSize: 24 }} />
					</Box>
					<StyledProfileMenu anchorEl={anchorElProfile} open={profileMenuOpen} onClose={handleProfileClose}>
						{!user?.isLoggedIn ? (
							<>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to login page
									}}
								>
									Login
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to signup page
									}}
								>
									Signup
								</MenuItem>
							</>
						) : user.role === 'DEALER' ? (
							<>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to dealer dashboard
									}}
								>
									Dealer Dashboard
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to my products
									}}
								>
									My Products
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to orders
									}}
								>
									Orders
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to earnings
									}}
								>
									Earnings
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										setUser(null);
										// Add logout logic
									}}
								>
									Logout
								</MenuItem>
							</>
						) : (
							<>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to my page
									}}
								>
									My Page
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to my orders
									}}
								>
									My Orders
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to wishlist
									}}
								>
									Wishlist
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										// Add navigation to recently viewed
									}}
								>
									Recently Viewed
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleProfileClose();
										setUser(null);
										// Add logout logic
									}}
								>
									Logout
								</MenuItem>
							</>
						)}
					</StyledProfileMenu>
					<Box component={'div'} className={'icon-btn'}>
						<FavoriteBorderIcon sx={{ color: 'primary.contrastText', fontSize: 24 }} />
					</Box>
					<Box component={'div'} className={'cart-section'}>
						<Box component={'div'} className={'cart-icon'}>
							<ShoppingCartOutlinedIcon sx={{ color: 'primary.contrastText', fontSize: 24 }} />
							<Box component={'div'} className={'cart-badge'} sx={{ bgcolor: 'error.main' }}>
								<Box component={'span'} sx={{ color: 'primary.contrastText' }}>
									0
								</Box>
							</Box>
						</Box>
						<Box component={'span'} className={'cart-price'} sx={{ color: 'text.primary', paddingLeft: '8px'}}>
							$0.00
						</Box>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default ActionBar;