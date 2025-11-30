import React, { MouseEvent, useState } from 'react';
import { Stack, Box, Typography, Tooltip } from '@mui/material';
import {
	FavoriteBorder as FavoriteBorderIcon,
	CompareArrows as CompareArrowsIcon,
	Visibility as VisibilityIcon,
	ShoppingCartOutlined as ShoppingCartOutlinedIcon,
	StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCompare } from '../../hooks/useCompare';
import { Product } from '../../types/product/product';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useCart } from '../../hooks/useCart';
import { sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface ProductCardProps {
	product: Product;
	likeProductHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
	addToCartHandler?: any;
	compareHandler?: any;
	quickViewHandler?: any;
}

const ProductCard = ({
	product,
	likeProductHandler,
	addToCartHandler: propAddToCartHandler,
	myFavorites,
	recentlyVisited,
	compareHandler,
	quickViewHandler,
}: ProductCardProps) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { addToCart } = useCart();
	const [isHovered, setIsHovered] = useState(false);
	const { isCompared, toggleCompare } = useCompare();
	const isInCompare = isCompared(product._id);
	const imagePath: string = product?.productImages?.[0]
		? `${REACT_APP_API_URL}/${product?.productImages[0]}`
		: '/img/banner/header1.svg';

	const handleCardClick = () => {
		if (!product?._id) return;
		router.push(`/product/detail?id=${product._id}`);
	};

	const stopPropagation = (event: MouseEvent) => {
		event.stopPropagation();
	};

	if (device === 'mobile') {
		return <div>PRODUCT CARD</div>;
	} else {
		return (
			<Stack
				className={'product-card'}
				onClick={handleCardClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => {
					setIsHovered(false);
				}}
			>
				<Stack className={'card-image-wrapper'}>
					{product.productSalePrice && product.productSalePrice > 0 && (
						<Box className={'sale-badge'}>
							<Typography variant="caption" className={'sale-text'}>
								SALE
							</Typography>
						</Box>
					)}
					<img src={imagePath} alt={product.productTitle} className={'product-image'} />
					<Stack className={`hover-actions ${isHovered ? 'visible' : ''}`}>
						<Box
							className={'action-icon'}
							onClick={(event) => {
								stopPropagation(event);
								likeProductHandler?.(user, product._id);
							}}
						>
							{myFavorites ? (
								<FavoriteIcon color="primary" />
							) : product?.meLiked && product?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color="primary" />
							) : (
								<FavoriteBorderIcon />
							)}
						</Box>
						<Tooltip title={isInCompare ? 'Remove from Compare' : 'Add to Compare'} arrow>
							<Box
								className={`action-icon ${isInCompare ? 'compared' : ''}`}
								onClick={(event) => {
									stopPropagation(event);
									toggleCompare(product);
									compareHandler?.(product._id);
								}}
							>
								<CompareArrowsIcon className={'icon'} />
							</Box>
						</Tooltip>
						<Box
							className={'action-icon'}
							onClick={(event) => {
								stopPropagation(event);
								quickViewHandler?.(product._id);
							}}
						>
							<VisibilityIcon className={'icon'} />
						</Box>
					</Stack>
				</Stack>
				<Stack className={`card-content ${isHovered ? 'hovered' : ''}`}>
					<Typography variant="body1" className={'product-title'}>
						{product.productTitle}
					</Typography>
					{product.productDescription && (
						<Typography variant="caption" className={'compatibility-text'}>
							{product.productDescription}
						</Typography>
					)}
					
					<Stack className={'rating-section'}>
						{[1, 2, 3, 4, 5].map((star) => (
							<StarBorderIcon key={star} className={'star-icon'} />
						))}
					</Stack>
					<Stack className={'price-section'}>
						{product.productPrice && (
							<Typography variant="body2" className={`original-price ${product.productSalePrice && product.productSalePrice > 0 ? 'sale' : ''}`}>
								${product.productPrice.toFixed(2)}
							</Typography>
						)}
						{product.productSalePrice && product.productSalePrice > 0 && (
							<Typography variant="h6" className={'sale-price'}>
								${product.productSalePrice?.toFixed(2)}
							</Typography>
						)}
					</Stack>
					{product.productCondition && (
						<Box className={'condition-badge'}>
							<Typography variant="caption" className={'condition-text'}>
								{product.productCondition}
							</Typography>
						</Box>
					)}
					<Box
						className={'add-to-cart-btn'}
						onClick={(event) => {
							stopPropagation(event);
							if (propAddToCartHandler) {
								propAddToCartHandler(product._id);
							} else {
								addToCart(product, 1);
								sweetTopSmallSuccessAlert('Product added to cart').then();
							}
						}}
					>
						<ShoppingCartOutlinedIcon className={'cart-icon'} />
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default ProductCard;
