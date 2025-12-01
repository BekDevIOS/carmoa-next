import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Stack, Box, Typography, MenuItem, Menu, MenuProps, IconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
	Menu as MenuIcon,
	ExpandMore as ExpandMoreIcon,
	LocalOffer as LocalOfferIcon,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useReactiveVar } from '@apollo/client';
import { themeVar, userVar } from '../../apollo/store';
import Link from 'next/link';
import { ProductMainCategory, ProductSubCategory } from '../enums/product.enum';
import { ProductsInquiry } from '../types/product/product.input';
import { Direction } from '../enums/common.enum';

const MainHeader = () => {
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
	const [expandedCategory, setExpandedCategory] = useState<ProductMainCategory | null>(null);
	const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const themeMode = useReactiveVar(themeVar);
	const user = useReactiveVar(userVar);
	const categoryMenuOpen = Boolean(categoryAnchor);
	const langMenuOpen = Boolean(langAnchor);

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
	const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
		setCategoryAnchor(event.currentTarget);
	};

	const handleCategoryClose = () => {
		setCategoryAnchor(null);
		setExpandedCategory(null);
	};

	const handleCategoryToggle = (category: ProductMainCategory) => {
		setExpandedCategory(expandedCategory === category ? null : category);
	};

	// Get subcategories based on main category
	const getSubCategories = (mainCategory: ProductMainCategory): ProductSubCategory[] => {
		switch (mainCategory) {
			case ProductMainCategory.ENGINE:
				return [
					ProductSubCategory.ENGINE_OIL_FILTER,
					ProductSubCategory.AIR_FILTER,
					ProductSubCategory.FUEL_PUMP,
					ProductSubCategory.RADIATOR,
					ProductSubCategory.ALTERNATOR,
					ProductSubCategory.BATTERY,
				];
			case ProductMainCategory.EXTERIOR:
				return [
					ProductSubCategory.BUMPER,
					ProductSubCategory.HEADLIGHT,
					ProductSubCategory.TAILLIGHT,
					ProductSubCategory.MIRROR,
				];
			case ProductMainCategory.INTERIOR:
				return [ProductSubCategory.STEERING_WHEEL, ProductSubCategory.SEAT, ProductSubCategory.DASHBOARD];
			case ProductMainCategory.SUSPENSION:
				return [ProductSubCategory.SHOCK_ABSORBER, ProductSubCategory.SPRING, ProductSubCategory.CONTROL_ARM];
			case ProductMainCategory.ELECTRICAL:
				return [ProductSubCategory.SENSOR, ProductSubCategory.ECU, ProductSubCategory.CABLE];
			default:
				return [];
		}
	};

	// Format category name for display
	const formatCategoryName = (category: string): string => {
		return category
			.split('_')
			.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
			.join(' ');
	};

	// Handle category navigation
	const handleCategoryNavigation = async (mainCategory?: ProductMainCategory, subCategory?: ProductSubCategory) => {
		try {
			const searchInput: ProductsInquiry = {
				page: 1,
				limit: 9,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {},
			};

			if (mainCategory) {
				searchInput.search.mainCategoryList = [mainCategory];
			}

			if (subCategory) {
				searchInput.search.subCategoryList = [subCategory];
			}

			const queryString = JSON.stringify(searchInput);
			await router.push(
				`/product?input=${queryString}`,
				`/product?input=${queryString}`,
				{ scroll: false },
			);
			handleCategoryClose();
		} catch (err: any) {
			console.log('ERROR, handleCategoryNavigation:', err);
		}
	};


	const mainCategories: ProductMainCategory[] = Object.values(ProductMainCategory) as ProductMainCategory[];

	const handleLangClick = (event: React.MouseEvent<HTMLElement>) => {
		setLangAnchor(event.currentTarget);
	};

	const handleLangClose = () => {
		setLangAnchor(null);
	};

	const handleThemeToggle = () => {
		const newMode = themeMode === 'light' ? 'dark' : 'light';
		themeVar(newMode);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setLangAnchor(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

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

	const StyledLangMenu = styled((props: MenuProps) => (
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
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				padding: '10px 16px',
				fontSize: 14,
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
		<Stack className={'main-header'} sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
			<Stack className={'container'}>
				{/* Left: Shop by Categories Button */}
				<Box component={'div'} className={'shop-categories-btn'} onClick={handleCategoryClick}>
					<MenuIcon className={'menu-icon'} sx={{ color: 'text.primary' }} />
					<Typography variant="body2" className={'categories-text'} sx={{ color: 'text.primary' }}>
						SHOP BY CATEGORIES
					</Typography>
					<ExpandMoreIcon className={'expand-icon'} sx={{ color: 'text.primary' }} />
				</Box>

				<StyledMenu anchorEl={categoryAnchor} open={categoryMenuOpen} onClose={handleCategoryClose}>
					<MenuItem onClick={() => handleCategoryNavigation()}>All Categories</MenuItem>
					{mainCategories.map((mainCategory: ProductMainCategory) => {
						const subCategories = getSubCategories(mainCategory);
						const hasSubCategories = subCategories.length > 0;
						const isExpanded = expandedCategory === mainCategory;
						return (
							<React.Fragment key={String(mainCategory)}>
								<MenuItem
									onClick={() => {
										if (hasSubCategories) {
											handleCategoryToggle(mainCategory);
										} else {
											handleCategoryNavigation(mainCategory);
										}
									}}
									sx={{
										fontWeight: 600,
										'&:hover': {
											backgroundColor: alpha(themeMode === 'light' ? '#000' : '#fff', 0.05),
										},
									}}
								>
									{formatCategoryName(String(mainCategory))}
									{hasSubCategories && (
										<ExpandMoreIcon
											sx={{
												ml: 'auto',
												fontSize: 18,
												color: 'text.secondary',
												transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
												transition: 'transform 0.2s',
											}}
										/>
									)}
								</MenuItem>
								{isExpanded && hasSubCategories && (
									<>
										<MenuItem
											onClick={() => handleCategoryNavigation(mainCategory)}
											sx={{
												pl: 4,
												fontSize: 13,
												fontWeight: 600,
												color: 'text.secondary',
												borderBottom: `1px solid ${alpha(themeMode === 'light' ? '#000' : '#fff', 0.1)}`,
												mb: 0.5,
											}}
										>
											All {formatCategoryName(String(mainCategory))}
										</MenuItem>
										{subCategories.map((subCategory: ProductSubCategory) => (
											<MenuItem
												key={String(subCategory)}
												onClick={() => handleCategoryNavigation(mainCategory, subCategory)}
												sx={{
													pl: 4,
													fontSize: 13,
													color: 'text.secondary',
												}}
											>
												{formatCategoryName(String(subCategory))}
											</MenuItem>
										))}
									</>
								)}
							</React.Fragment>
						);
					})}
				</StyledMenu>

				{/* Center: Navigation Links */}
				<Box component={'div'} className={'nav-links'}>
					<Link href={'/'}>
						<Box
							component={'div'}
							className={router.pathname === '/' ? 'nav-link active' : 'nav-link'}
							sx={router.pathname === '/' ? { bgcolor: 'primary.main' } : {}}
						>
							<Typography
								variant="body2"
								className={'nav-link-text'}
								sx={router.pathname === '/' ? { color: 'primary.contrastText' } : { color: 'text.primary' }}
							>
								HOME
							</Typography>
						</Box>
					</Link>
					<Link href={'/product'}>
						<Box
							component={'div'}
							className={router.pathname.startsWith('/product') ? 'nav-link active' : 'nav-link'}
							sx={router.pathname.startsWith('/product') ? { bgcolor: 'primary.main' } : {}}
						>
							<Typography
								variant="body2"
								className={'nav-link-text'}
								sx={
									router.pathname.startsWith('/product')
										? { color: 'primary.contrastText' }
										: { color: 'text.primary' }
								}
							>
								Products
							</Typography>
						</Box>
					</Link>
					<Link href={'/blog'}>
						<Box
							component={'div'}
							className={router.pathname.startsWith('/blog') || router.pathname.startsWith('/community') ? 'nav-link active' : 'nav-link'}
							sx={router.pathname.startsWith('/blog') || router.pathname.startsWith('/community') ? { bgcolor: 'primary.main' } : {}}
						>
							<Typography
								variant="body2"
								className={'nav-link-text'}
								sx={
									router.pathname.startsWith('/blog') || router.pathname.startsWith('/community')
										? { color: 'primary.contrastText' }
										: { color: 'text.primary' }
								}
							>
								Blog
							</Typography>
						</Box>
					</Link>
					<Link href={'/about'}>
						<Box
							component={'div'}
							className={router.pathname === '/about' ? 'nav-link active no-icon' : 'nav-link no-icon'}
							sx={router.pathname === '/about' ? { bgcolor: 'primary.main' } : {}}
						>
							<Typography
								variant="body2"
								className={'nav-link-text'}
								sx={router.pathname === '/about' ? { color: 'primary.contrastText' } : { color: 'text.primary' }}
							>
								About Us
							</Typography>
						</Box>
					</Link>
					{user?._id && (
						<Link href={'/mypage'}>
							<Box
								component={'div'}
								className={router.pathname.startsWith('/mypage') ? 'nav-link active no-icon' : 'nav-link no-icon'}
								sx={router.pathname.startsWith('/mypage') ? { bgcolor: 'primary.main' } : {}}
							>
								<Typography
									variant="body2"
									className={'nav-link-text'}
									sx={router.pathname.startsWith('/mypage') ? { color: 'primary.contrastText' } : { color: 'text.primary' }}
								>
									My Page
								</Typography>
							</Box>
						</Link>
					)}
					<Link href={'/cs'}>
						<Box
							component={'div'}
							className={router.pathname === '/cs' ? 'nav-link active no-icon' : 'nav-link no-icon'}
							sx={router.pathname === '/cs' ? { bgcolor: 'primary.main' } : {}}
						>
							<Typography
								variant="body2"
								className={'nav-link-text'}
								sx={router.pathname === '/cs' ? { color: 'primary.contrastText' } : { color: 'text.primary' }}
							>
								CS
							</Typography>
						</Box>
					</Link>
				</Box>

				{/* Right: Utility Options */}
				<Box component={'div'} className={'utility-options'}>
					{/* Sale Off */}
					<Box component={'div'} className={'sale-off'}>
						<LocalOfferIcon className={'sale-icon'} sx={{ color: 'text.primary' }} />
						<Typography variant="body2" className={'sale-text'} sx={{ color: 'text.primary' }}>
							Sale Off
						</Typography>
					</Box>

					{/* Vertical Separator */}
					<Box component={'div'} className={'vertical-separator'} sx={{ bgcolor: 'divider' }} />

					{/* Language Selector */}
					<Box component={'div'} className={'lang-selector'} onClick={handleLangClick}>
						<img className="img-flag" src={'/img/flag/langen.png'} alt={'usaFlag'} />
						<Typography variant="body2" className={'lang-text'} sx={{ color: 'text.primary' }}>
							English
						</Typography>
						<ExpandMoreIcon className={'lang-icon'} sx={{ color: 'text.primary' }} />
					</Box>

					<StyledLangMenu anchorEl={langAnchor} open={langMenuOpen} onClose={handleLangClose}>
						<MenuItem disableRipple onClick={langChoice} id="en">
							<img className="img-flag" src={'/img/flag/langen.png'} onClick={langChoice} id="en" alt={'usaFlag'} />
							{t('English')}
						</MenuItem>
						<MenuItem disableRipple onClick={langChoice} id="kr">
							<img className="img-flag" src={'/img/flag/langkr.png'} onClick={langChoice} id="kr" alt={'koreanFlag'} />
							{t('Korean')}
						</MenuItem>
						<MenuItem disableRipple onClick={langChoice} id="ru">
							<img className="img-flag" src={'/img/flag/langru.png'} onClick={langChoice} id="ru" alt={'russiaFlag'} />
							{t('Russian')}
						</MenuItem>
					</StyledLangMenu>

					{/* Vertical Separator */}
					<Box component={'div'} className={'vertical-separator'} sx={{ bgcolor: 'divider' }} />

					{/* Theme Mode Toggle */}
					<Box component={'div'} className={'theme-toggle'}>
						<IconButton
							onClick={handleThemeToggle}
							className={'theme-toggle-btn'}
							sx={{ color: 'text.primary' }}
							size="small"
						>
							{themeMode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
						</IconButton>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default MainHeader;
