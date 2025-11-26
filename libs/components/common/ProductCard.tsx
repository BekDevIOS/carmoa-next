import React, { useState } from 'react';
import { Stack, Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
	FavoriteBorder as FavoriteBorderIcon,
	CompareArrows as CompareArrowsIcon,
	Visibility as VisibilityIcon,
	ShoppingCartOutlined as ShoppingCartOutlinedIcon,
	StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useCompare } from '../../hooks/useCompare';

interface Product {
	id: number;
	image: string;
	category?: string;
	title: string;
	originalPrice?: number;
	salePrice: number;
	discount?: number;
	rating?: number;
	compatibility?: string;
	condition?: 'New' | 'Used' | 'Refurbished';
	isSale?: boolean;
}

interface ProductCardProps {
	product: Product;
	addToCartHandler?: (productId: number) => void;
	wishlistHandler?: (productId: number) => void;
	compareHandler?: (productId: number) => void;
	quickViewHandler?: (productId: number) => void;
}

const ProductCard = ({
	product,
	addToCartHandler,
	wishlistHandler,
	compareHandler,
	quickViewHandler,
}: ProductCardProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const { isCompared, toggleCompare } = useCompare();
	const isInCompare = isCompared(product.id);

	return (
		<Stack
			className={'product-card'}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				setIsHovered(false);
			}}
		>
			<Stack className={'card-image-wrapper'}>
				{(product.isSale || product.discount) && (
					<Box className={'sale-badge'}>
						<Typography variant="caption" className={'sale-text'}>
							SALE
						</Typography>
					</Box>
				)}
				<img src={product.image} alt={product.title} className={'product-image'} />
				<Stack className={`hover-actions ${isHovered ? 'visible' : ''}`}>
					<Box className={'action-icon'} onClick={() => wishlistHandler?.(product.id)}>
						<FavoriteBorderIcon className={'icon'} />
					</Box>
					<Tooltip title={isInCompare ? 'Remove from Compare' : 'Add to Compare'} arrow>
						<Box 
							className={`action-icon ${isInCompare ? 'compared' : ''}`} 
							onClick={() => {
								toggleCompare(product);
								compareHandler?.(product.id);
							}}
						>
							<CompareArrowsIcon className={'icon'} />
						</Box>
					</Tooltip>
					<Box className={'action-icon'} onClick={() => quickViewHandler?.(product.id)}>
						<VisibilityIcon className={'icon'} />
					</Box>
				</Stack>
			</Stack>
			<Stack className={`card-content ${isHovered ? 'hovered' : ''}`}>
				<Typography variant="body1" className={'product-title'}>
					{product.title}
				</Typography>
				{product.compatibility && (
					<Typography variant="caption" className={'compatibility-text'}>
						{product.compatibility}
					</Typography>
				)}
				{product.condition && (
					<Box className={'condition-badge'}>
						<Typography variant="caption" className={'condition-text'}>
							{product.condition}
						</Typography>
					</Box>
				)}
				<Stack className={'rating-section'}>
					{[1, 2, 3, 4, 5].map((star) => (
						<StarBorderIcon key={star} className={'star-icon'} />
					))}
				</Stack>
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
				<Box
					className={'add-to-cart-btn'}
					onClick={() => addToCartHandler?.(product.id)}
				>
					<ShoppingCartOutlinedIcon className={'cart-icon'} />
				</Box>
			</Stack>
		</Stack>
	);
};

export default ProductCard;

