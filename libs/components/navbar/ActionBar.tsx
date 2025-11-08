import React from 'react';
import { Stack, Box } from '@mui/material';
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
						SHOP DEPARTMENTS
					</Box>
					<ExpandMoreIcon sx={{ color: 'secondary.contrastText', fontSize: 16 }} />
				</Box>
				<Box component={'div'} className={'search-section'} sx={{ bgcolor: 'background.paper' }}>
					<input type="text" placeholder="Search for Products..." className={'search-input'} />
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
					<Box component={'div'} className={'icon-btn'}>
            <PersonOutlineIcon sx={{ color: 'primary.contrastText', fontSize: 24 }} />
					</Box>
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