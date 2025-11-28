import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import {
	ShoppingCart as ShoppingCartIcon,
	FavoriteBorder as FavoriteBorderIcon,
	CompareArrows as ShuffleIcon,
} from '@mui/icons-material';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';

interface FeaturedProductCardProps {
	product: Product;
	addToCartHandler?: (productId: string) => void;
	wishlistHandler?: (productId: string) => void;
	compareHandler?: (productId: string) => void;
}

const FeaturedProductCard = ({
	product,
	addToCartHandler,
	wishlistHandler,
	compareHandler,
}: FeaturedProductCardProps) => {
	const [isHovered, setIsHovered] = useState(false);

	// Map product fields
	const imageUrl = product?.productImages?.[0]
		? `${REACT_APP_API_URL}/${product.productImages[0]}`
		: '/img/product/image1.png';
	
	const title = product.productTitle || '';
	const salePrice = product.productSalePrice;
	const originalPrice = product.productPrice;
	
	// Calculate discount percentage if both prices exist
	const discount = salePrice && originalPrice && originalPrice > salePrice
		? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
		: undefined;

	return (
		<Stack
			className={'featured-product-card'}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Box className={'card-image-wrapper'}>
				{discount && (
					<Box className={'discount-badge'}>
						<Typography variant="caption" className={'discount-text'}>
							-{discount}%
						</Typography>
					</Box>
				)}
				<img src={imageUrl} alt={title} className={'product-image'} />
			</Box>
			<Stack className={'card-content'}>
				<Typography variant="body1" className={'product-title'}>
					{title}
				</Typography>
				<Stack className={'price-section'}>
					{salePrice ? (
						<>
							<Typography variant="body1" className={'sale-price'}>
								${salePrice.toFixed(2)}
							</Typography>
							{originalPrice && originalPrice > salePrice && (
								<Typography variant="body2" className={'original-price'}>
									${originalPrice.toFixed(2)}
								</Typography>
							)}
						</>
					) : (
						originalPrice && (
							<Typography variant="body1" className={'sale-price'}>
								${originalPrice.toFixed(2)}
							</Typography>
						)
					)}
				</Stack>
				{isHovered && (
					<Stack className={'hover-actions'}>
						<Box className={'action-btn'} onClick={() => addToCartHandler?.(product._id)}>
							<ShoppingCartIcon className={'action-icon'} />
						</Box>
						<Box className={'action-btn'} onClick={() => wishlistHandler?.(product._id)}>
							<FavoriteBorderIcon className={'action-icon'} />
						</Box>
						<Box className={'action-btn'} onClick={() => compareHandler?.(product._id)}>
							<ShuffleIcon className={'action-icon'} />
						</Box>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
};

export default FeaturedProductCard;

