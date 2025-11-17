import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import {
	ShoppingCart as ShoppingCartIcon,
	FavoriteBorder as FavoriteBorderIcon,
	CompareArrows as ShuffleIcon,
} from '@mui/icons-material';

export interface Product {
	id: number;
	image: string;
	title: string;
	salePrice?: number;
	originalPrice?: number;
	priceRange?: {
		min: number;
		max: number;
	};
	discount?: number;
}

interface FeaturedProductCardProps {
	product: Product;
	addToCartHandler?: (productId: number) => void;
	wishlistHandler?: (productId: number) => void;
	compareHandler?: (productId: number) => void;
}

const FeaturedProductCard = ({
	product,
	addToCartHandler,
	wishlistHandler,
	compareHandler,
}: FeaturedProductCardProps) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Stack
			className={'featured-product-card'}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Box className={'card-image-wrapper'}>
				{product.discount && (
					<Box className={'discount-badge'}>
						<Typography variant="caption" className={'discount-text'}>
							-{product.discount}%
						</Typography>
					</Box>
				)}
				<img src={product.image} alt={product.title} className={'product-image'} />
			</Box>
			<Stack className={'card-content'}>
				<Typography variant="body1" className={'product-title'}>
					{product.title}
				</Typography>
				<Stack className={'price-section'}>
					{product.priceRange ? (
						<Typography variant="body1" className={'price-range'}>
							${product.priceRange.min.toFixed(2)} - ${product.priceRange.max.toFixed(2)}
						</Typography>
					) : (
						<>
							{product.salePrice && (
								<Typography variant="body1" className={'sale-price'}>
									${product.salePrice.toFixed(2)}
								</Typography>
							)}
							{product.originalPrice && (
								<Typography variant="body2" className={'original-price'}>
									${product.originalPrice.toFixed(2)}
								</Typography>
							)}
						</>
					)}
				</Stack>
				{isHovered && (
					<Stack className={'hover-actions'}>
						<Box className={'action-btn'} onClick={() => addToCartHandler?.(product.id)}>
							<ShoppingCartIcon className={'action-icon'} />
						</Box>
						<Box className={'action-btn'} onClick={() => wishlistHandler?.(product.id)}>
							<FavoriteBorderIcon className={'action-icon'} />
						</Box>
						<Box className={'action-btn'} onClick={() => compareHandler?.(product.id)}>
							<ShuffleIcon className={'action-icon'} />
						</Box>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
};

export default FeaturedProductCard;

