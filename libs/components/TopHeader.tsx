import React, { useState } from 'react';
import { Stack, Box, Typography, MenuItem, Menu, MenuProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
	Search as SearchIcon,
	ExpandMore as ExpandMoreIcon,
	HeadsetMic as HeadsetMicIcon,
	PersonOutline as PersonOutlineIcon,
	NotificationsOutlined as NotificationsOutlinedIcon,
	FavoriteBorder as FavoriteBorderIcon,
	ShoppingCartOutlined as ShoppingCartOutlinedIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Cart from './Cart';

const TopHeader = () => {
	const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
	const categoryMenuOpen = Boolean(categoryAnchor);
	const [cartOpen, setCartOpen] = useState(false);

	const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
		setCategoryAnchor(event.currentTarget);
	};

	const handleCategoryClose = () => {
		setCategoryAnchor(null);
	};

	const handleCartOpen = () => {
		setCartOpen(true);
	};

	const handleCartClose = () => {
		setCartOpen(false);
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
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
		<Stack className={'top-header'} sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
			<Stack className={'container'} sx={{ py: 2 }}>
				{/* Logo */}
				<Box component={'div'} className={'logo-section'}>
					<Link href={'/'} className={'logo-link'}>
						<Box component={'div'} className={'logo-wrapper'}>
							<img src="/img/logo/logoWhite.png" alt="AutoGarage Logo" />
						</Box>
					</Link>
				</Box>

				{/* Search Bar */}
				<Box component={'div'} className={'search-section'} sx={{ mx: 3 }}>
					<Box component={'div'} className={'search-bar'} sx={{ borderColor: 'divider', bgcolor: 'background.paper' }}>
						{/* Category Dropdown */}
						<Box
							component={'div'}
							className={'category-dropdown'}
							onClick={handleCategoryClick}
							sx={{ px: 2, py: 1.5, borderColor: 'grey.300', bgcolor: 'background.default' }}
						>
							<Typography variant="body2" className={'category-text'} sx={{ color: 'text.primary', mr: 1 }}>
								All Categories
							</Typography>
							<ExpandMoreIcon className={'category-icon'} sx={{ color: 'text.primary' }} />
						</Box>
						<Box component={'div'} className={'vertical-separator'} sx={{ bgcolor: 'divider' }} />

						<StyledMenu anchorEl={categoryAnchor} open={categoryMenuOpen} onClose={handleCategoryClose}>
							<MenuItem onClick={handleCategoryClose}>All Categories</MenuItem>
							<MenuItem onClick={handleCategoryClose}>Engine Parts</MenuItem>
							<MenuItem onClick={handleCategoryClose}>Body Parts</MenuItem>
							<MenuItem onClick={handleCategoryClose}>Interior Parts</MenuItem>
							<MenuItem onClick={handleCategoryClose}>Accessories</MenuItem>
						</StyledMenu>

						{/* Search Input */}
						<Box
							component={'input'}
							type="text"
							placeholder="Search for anything"
							className={'search-input'}
							sx={{ px: 2, py: 1.5, color: 'text.primary', bgcolor: 'background.default' }}
						/>

						{/* Search Button */}
						<Box component={'div'} className={'search-btn'} sx={{ bgcolor: 'background.paper' }}>
							<SearchIcon className={'search-icon'} sx={{ color: 'text.primary' }} />
						</Box>
					</Box>
				</Box>

				{/* Contact Info */}
				<Box component={'div'} className={'contact-section'} sx={{ gap: 2 }}>
					<HeadsetMicIcon className={'contact-icon'} sx={{ color: 'primary.main' }} />
					<Box component={'div'} className={'contact-info'}>
						<Typography variant="caption" className={'contact-email'} sx={{ color: 'text.secondary' }}>
							carmoa@marketplace.com
						</Typography>
						<Typography variant="body2" className={'contact-phone'} sx={{ color: 'text.primary' }}>
							+82 10 5700 4474
						</Typography>
					</Box>
				</Box>

				{/* Icons */}
				<Box component={'div'} className={'utility-icons'} sx={{ gap: 1, ml: 2 }}>
					{/* Profile */}
					<Box className={'icon-btn'} sx={{ borderColor: 'divider' }}>
						<PersonOutlineIcon className={'icon'} sx={{ color: 'text.primary' }} />
					</Box>

					{/* Notification */}
					<Box className={'icon-btn'} sx={{ borderColor: 'divider' }}>
						<NotificationsOutlinedIcon className={'icon'} sx={{ color: 'text.primary' }} />
					</Box>

					{/* Wishlist */}
					<Box className={'icon-btn wishlist-btn'} sx={{ borderColor: 'divider' }}>
						<FavoriteBorderIcon className={'icon'} sx={{ color: 'text.primary' }} />
						<Box component={'span'} className={'wishlist-badge'} sx={{ color: 'text.primary' }}>
							0
						</Box>
					</Box>

					{/* Cart Button */}
					<Box className={'cart-btn'} sx={{ px: 2, py: 1, bgcolor: 'primary.main', cursor: 'pointer' }} onClick={handleCartOpen}>
						<ShoppingCartOutlinedIcon className={'cart-icon'} sx={{ color: 'primary.contrastText' }} />
						<Typography variant="body2" className={'cart-text'} sx={{ color: 'primary.contrastText' }}>
							Cart
						</Typography>
						<Box component={'div'} className={'cart-badge'} sx={{ bgcolor: 'text.primary' }}>
							<Typography variant="caption" className={'cart-badge-text'} sx={{ color: 'background.paper' }}>
								0
							</Typography>
						</Box>
					</Box>
				</Box>
			</Stack>
			
			{/* Cart Drawer */}
			<Cart open={cartOpen} onClose={handleCartClose} />
		</Stack>
	);
};

export default TopHeader;
