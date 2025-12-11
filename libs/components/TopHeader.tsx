import React, { useState } from 'react';
import { Stack, Box, Typography, MenuItem, Menu, MenuProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import {
	Search as SearchIcon,
	ExpandMore as ExpandMoreIcon,
	HeadsetMic as HeadsetMicIcon,
	PersonOutline as PersonOutlineIcon,
	NotificationsOutlined as NotificationsOutlinedIcon,
	FavoriteBorder as FavoriteBorderIcon,
	ShoppingCartOutlined as ShoppingCartOutlinedIcon,
} from '@mui/icons-material';
import { useReactiveVar, useQuery } from '@apollo/client';
import { themeVar, userVar } from '../../apollo/store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cart from './cart/Cart';
import MainHeader from './MainHeader';
import { useCart } from '../hooks/useCart';
import { logOut } from '../auth';
import { Logout } from '@mui/icons-material';
import { getMemberImageUrl } from '../config';
import { GET_FAVORITES } from '../../apollo/user/query';
import { ProductMainCategory } from '../enums/product.enum';
import { ProductsInquiry } from '../types/product/product.input';
import { Direction } from '../enums/common.enum';
import useDeviceDetect from '../hooks/useDeviceDetect';
import {
	Menu as MenuIcon,
	NotificationsNone as NotificationsNoneIcon,
	FavoriteBorder as FavoriteBorderIconMobile,
	ShoppingCartOutlined as ShoppingCartOutlinedMobileIcon,
	AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { Avatar, Badge, IconButton } from '@mui/material';

const TopHeader = () => {
	const { t } = useTranslation('common');
	const themeMode = useReactiveVar(themeVar);
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { getCartCount } = useCart();
	const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
	const categoryMenuOpen = Boolean(categoryAnchor);
	const [selectedCategory, setSelectedCategory] = useState<ProductMainCategory | null>(null);
	const [searchText, setSearchText] = useState<string>('');
	const [cartOpen, setCartOpen] = useState(false);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const cartCount = getCartCount();
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const device = useDeviceDetect();
	// Get favorites count - will update automatically via refetchQueries
	const { data: favoritesData } = useQuery(GET_FAVORITES, {
		skip: !user?._id,
		fetchPolicy: 'cache-and-network',
		variables: {
			input: { page: 1, limit: 1 },
		},
	});

	const favoritesCount = favoritesData?.getFavorites?.metaCounter?.[0]?.total || 0;

	const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
		setCategoryAnchor(event.currentTarget);
	};

	const handleCategoryClose = () => {
		setCategoryAnchor(null);
	};

	// Format category name for display with translation
	const formatCategoryName = (category: string): string => {
		const formatted = category
			.split('_')
			.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
			.join(' ');
		return t(formatted);
	};

	// Handle category selection
	const handleCategorySelect = (category: ProductMainCategory | null) => {
		setSelectedCategory(category);
		handleCategoryClose();
	};

	// Handle search
	const handleSearch = async () => {
		try {
			const searchInput: ProductsInquiry = {
				page: 1,
				limit: 9,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {},
			};

			if (selectedCategory) {
				searchInput.search.mainCategoryList = [selectedCategory];
			}

			if (searchText.trim()) {
				searchInput.search.text = searchText.trim();
			}

			const queryString = JSON.stringify(searchInput);
			await router.push(`/product?input=${queryString}`, `/product?input=${queryString}`, { scroll: false });
		} catch (err: any) {
			console.log('ERROR, handleSearch:', err);
		}
	};

	const mainCategories = Object.values(ProductMainCategory) as ProductMainCategory[];

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

	if (device === 'mobile') {
		return (
			<>
				<Stack className={'top-header mobile'}>
					<Stack className={'mobile-bar'} direction="row" alignItems="center" spacing={1.25}>
						<IconButton aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className={'mobile-menu-btn'}>
							<MenuIcon />
						</IconButton>

						<Link href={'/'} className={'logo-link'}>
							<Box component={'div'} className={'logo-wrapper'}>
								<img src="/img/logo/favicon.png" alt="CarMoa Logo" />
							</Box>
						</Link>

						<Box className={'mobile-search-wrapper'}>
							<input
								type="text"
								placeholder={t('Search') || 'Search'}
								className={'mobile-search-input'}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										handleSearch();
									}
								}}
							/>
							<IconButton aria-label="Search" onClick={handleSearch} className={'mobile-search-icon-btn'}>
								<SearchIcon />
							</IconButton>
						</Box>

						<Stack direction="row" alignItems="center" spacing={0.5} className={'mobile-icons'}>
							<IconButton aria-label="Notifications">
								<NotificationsNoneIcon />
							</IconButton>
							<Link href={'/mypage?category=myFavorites'}>
								<IconButton aria-label="Wishlist">
									<Badge badgeContent={favoritesCount} color="primary">
										<FavoriteBorderIconMobile />
									</Badge>
								</IconButton>
							</Link>
							<IconButton aria-label="Cart" onClick={handleCartOpen}>
								<Badge badgeContent={cartCount} color="primary">
									<ShoppingCartOutlinedMobileIcon />
								</Badge>
							</IconButton>
							{user?._id ? (
								<IconButton aria-label="Profile" onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
									<Avatar src={getMemberImageUrl(user?.memberImage)} sx={{ width: 28, height: 28 }} />
								</IconButton>
							) : (
								<Link href={'/account/join'}>
									<IconButton aria-label="Login">
										<AccountCircleIcon />
									</IconButton>
								</Link>
							)}
						</Stack>
					</Stack>
				</Stack>

				<MainHeader mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

				<Menu
					id="logout-menu-mobile"
					anchorEl={logoutAnchor}
					open={logoutOpen}
					onClose={() => setLogoutAnchor(null)}
					sx={{ mt: '5px' }}
				>
					<MenuItem onClick={() => logOut()}>
						<Logout fontSize="small" className={'logout-icon'} />
						{t('Logout')}
					</MenuItem>
				</Menu>

				<Cart open={cartOpen} onClose={handleCartClose} />
			</>
		);
	} else {
		return (
			<Stack className={'top-header'} sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
				<Stack className={'container'} sx={{ py: 2 }}>
					{/* Logo */}
					<Box component={'div'} className={'logo-section'}>
						<Link href={'/'} className={'logo-link'}>
							<Box component={'div'} className={'logo-wrapper'}>
								<img
									src={themeMode === 'dark' ? '/img/logo/logoTopLight.png' : '/img/logo/logoTopDark.png'}
									alt="AutoGarage Logo"
								/>
							</Box>
						</Link>
					</Box>

					{/* Search Bar */}
					<Box component={'div'} className={'search-section'} sx={{ mx: 3 }}>
						<Box
							component={'div'}
							className={'search-bar'}
							sx={{ borderColor: 'divider', bgcolor: 'background.paper' }}
						>
							{/* Category Dropdown */}
							<Box
								component={'div'}
								className={'category-dropdown'}
								onClick={handleCategoryClick}
								sx={{ px: 2, py: 1.5, borderColor: 'grey.300', bgcolor: 'background.default', cursor: 'pointer' }}
							>
								<Typography variant="body2" className={'category-text'} sx={{ color: 'text.primary', mr: 1 }}>
									{selectedCategory ? formatCategoryName(selectedCategory) : t('All Categories')}
								</Typography>
								<ExpandMoreIcon className={'category-icon'} sx={{ color: 'text.primary' }} />
							</Box>
							<Box component={'div'} className={'vertical-separator'} sx={{ bgcolor: 'divider' }} />

							<StyledMenu anchorEl={categoryAnchor} open={categoryMenuOpen} onClose={handleCategoryClose}>
								<MenuItem onClick={() => handleCategorySelect(null)}>{t('All Categories')}</MenuItem>
								{mainCategories.map((category: ProductMainCategory) => (
									<MenuItem key={String(category)} onClick={() => handleCategorySelect(category)}>
										{formatCategoryName(String(category))}
									</MenuItem>
								))}
							</StyledMenu>

							{/* Search Input */}
							<Box
								component={'input'}
								type="text"
								placeholder={(t('Search for anything') as string) || 'Search for anything'}
								className={'search-input'}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										handleSearch();
									}
								}}
								sx={{ px: 2, py: 1.5, color: 'text.primary', bgcolor: 'background.default' }}
							/>

							{/* Search Button */}
							<Box
								component={'div'}
								className={'search-btn'}
								sx={{ bgcolor: 'background.paper', cursor: 'pointer' }}
								onClick={handleSearch}
							>
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
						{user?._id ? (
							<>
								<Box className={'icon-btn login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
									<img src={getMemberImageUrl(user?.memberImage)} alt="User" />
								</Box>
								<Menu
									id="basic-menu"
									anchorEl={logoutAnchor}
									open={logoutOpen}
									onClose={() => {
										setLogoutAnchor(null);
									}}
									sx={{ mt: '5px' }}
								>
									<MenuItem onClick={() => logOut()}>
										<Logout fontSize="small" className={'logout-icon'} />
										{t('Logout')}
									</MenuItem>
								</Menu>
							</>
						) : (
							<Link href={'/account/join'}>
								<Box className={'icon-btn'} sx={{ borderColor: 'divider', cursor: 'pointer' }}>
									<PersonOutlineIcon className={'icon'} sx={{ color: 'text.primary' }} />
								</Box>
							</Link>
						)}

						{/* Notification */}
						<Box className={'icon-btn'} sx={{ borderColor: 'divider' }}>
							<NotificationsOutlinedIcon className={'icon'} sx={{ color: 'text.primary' }} />
						</Box>

						{/* Wishlist */}
						<Link href={'/mypage?category=myFavorites'}>
							<Box className={'icon-btn wishlist-btn'} sx={{ borderColor: 'divider', cursor: 'pointer' }}>
								<FavoriteBorderIcon className={'icon'} sx={{ color: 'text.primary' }} />
								<Box component={'span'} className={'wishlist-badge'}>
									{favoritesCount}
								</Box>
							</Box>
						</Link>

						{/* Cart Button */}
						<Box
							className={'cart-btn'}
							sx={{ px: 2, py: 1, bgcolor: 'primary.main', cursor: 'pointer' }}
							onClick={handleCartOpen}
						>
							<ShoppingCartOutlinedIcon className={'cart-icon'} sx={{ color: 'primary.contrastText' }} />
							<Typography variant="body2" className={'cart-text'} sx={{ color: 'primary.contrastText' }}>
								{t('Cart')}
							</Typography>
							{cartCount > 0 && (
								<Box component={'div'} className={'cart-badge'} sx={{ bgcolor: 'text.primary' }}>
									<Typography variant="caption" className={'cart-badge-text'} sx={{ color: 'background.paper' }}>
										{cartCount}
									</Typography>
								</Box>
							)}
						</Box>
					</Box>
				</Stack>

				{/* Cart Drawer */}
				<Cart open={cartOpen} onClose={handleCartClose} />
			</Stack>
		);
	}
};

export default TopHeader;
