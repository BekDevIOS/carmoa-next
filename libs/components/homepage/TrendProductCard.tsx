import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import {
	FavoriteBorder as FavoriteBorderIcon,
	CompareArrows as CompareArrowsIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface Product {
	id: number;
	image: string;
	category: string;
	title: string;
	originalPrice?: number;
	salePrice: number;
	discount?: number;
}

interface TrendProductCardProps {
	product: Product;
	addToCartHandler?: (productId: number) => void;
	wishlistHandler?: (productId: number) => void;
	compareHandler?: (productId: number) => void;
	quickViewHandler?: (productId: number) => void;
}

const TrendProductCard = ({
	product,
	addToCartHandler,
	wishlistHandler,
	compareHandler,
	quickViewHandler,
}: TrendProductCardProps) => {
	return (
		<Stack className={'trend-product-card'}>
			<Stack className={'card-image-wrapper'}>
				{product.discount && (
					<Box className={'sale-badge'} sx={{ backgroundColor: 'primary.main' }}>
						<Typography variant="caption" className={'sale-text'} sx={{ color: 'primary.contrastText' }}>
							Sale
						</Typography>
					</Box>
				)}
				<img src={product.image} alt={product.title} className={'product-image'} />
				<Stack className={'hover-actions'}>
					<Box className={'action-icon'} onClick={() => wishlistHandler?.(product.id)}>
						<FavoriteBorderIcon className={'icon'} />
					</Box>
					<Box className={'action-icon'} onClick={() => compareHandler?.(product.id)}>
						<CompareArrowsIcon className={'icon'} />
					</Box>
					<Box className={'action-icon'} onClick={() => quickViewHandler?.(product.id)}>
						<VisibilityIcon className={'icon'} />
					</Box>
				</Stack>
			</Stack>
			<Stack className={'card-content'}>
				<Box className={'add-to-cart-btn'} onClick={() => addToCartHandler?.(product.id)}>
					<Typography variant="button" className={'cart-btn-text'}>
						ADD TO CART
					</Typography>
				</Box>
				<Typography variant="caption" className={'product-category'}>
					{product.category}
				</Typography>
				<Typography variant="body1" className={'product-title'}>
					{product.title}
				</Typography>
				<Stack className={'price-section'}>
					{product.originalPrice && (
						<Typography variant="body2" className={'original-price'}>
							${product.originalPrice.toFixed(2)}
						</Typography>
					)}
					<Typography variant="h6" className={'sale-price'}>
						${product.salePrice.toFixed(2)}
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default TrendProductCard;
