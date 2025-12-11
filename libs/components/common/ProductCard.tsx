import React, { MouseEvent, useState } from 'react';
import { Stack, Box, Typography, Tooltip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import {
	FavoriteBorder as FavoriteBorderIcon,
	CompareArrows as CompareArrowsIcon,
	Visibility as VisibilityIcon,
	ShoppingCartOutlined as ShoppingCartOutlinedIcon,
	StarBorder as StarBorderIcon,
	Star as StarIcon,
} from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCompare } from '../../hooks/useCompare';
import { Product } from '../../types/product/product';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar, openQuickView } from '../../../apollo/store';
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
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { addToCart } = useCart();
	const [isHovered, setIsHovered] = useState(false);
	const { isCompared, toggleCompare } = useCompare();
	const isInCompare = isCompared(product._id);
	const isLiked = myFavorites || Boolean(product?.meLiked && product?.meLiked[0]?.myFavorite);
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
		return (
			<Stack
				className={'product-card mobile'}
				onClick={handleCardClick}
				sx={{ cursor: 'pointer', width: '100%' }}
			>
				<Stack className={'card-image-wrapper mobile'}>
					{product.productSalePrice && product.productSalePrice > 0 && (
						<Box className={'sale-badge mobile'}>
							<Typography variant="caption" className={'sale-text mobile'}>
								{t('SALE')}
							</Typography>
						</Box>
					)}
					<img src={imagePath} alt={product.productTitle} className={'product-image mobile'} />
					<Box
						className={`favorite-icon mobile ${isLiked ? 'liked' : ''}`}
						onClick={(event) => {
							stopPropagation(event);
							likeProductHandler?.(user, product._id);
						}}
					>
						{isLiked ? (
							<FavoriteIcon className={'icon mobile'} />
						) : (
							<FavoriteBorderIcon className={'icon mobile'} />
						)}
					</Box>
				</Stack>
				<Stack className={'card-content mobile'}>
					<Typography variant="body1" className={'product-title mobile'}>
						{product.productTitle}
					</Typography>
					<Stack className={'price-section mobile'}>
						{product.productSalePrice && product.productSalePrice > 0 && (
							<Typography variant="h6" className={'sale-price mobile'}>
								${product.productSalePrice?.toFixed(2)}
							</Typography>
						)}
						{product.productPrice && (
							<Typography variant="body2" className={`original-price mobile ${product.productSalePrice && product.productSalePrice > 0 ? 'sale' : ''}`}>
								${product.productPrice.toFixed(2)}
							</Typography>
						)}
					</Stack>
					{product.productCondition && (
						<Box className={'condition-badge mobile'}>
							<Typography variant="caption" className={'condition-text mobile'}>
								{product.productCondition}
							</Typography>
						</Box>
					)}
					<Box
						className={'add-to-cart-btn mobile'}
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
						<ShoppingCartOutlinedIcon className={'cart-icon mobile'} />
						<Typography variant="body2" className={'cart-text mobile'}>
							{t('Add to Cart')}
						</Typography>
					</Box>
				</Stack>
			</Stack>
		);
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
								{t('SALE')}
							</Typography>
						</Box>
					)}
					<img src={imagePath} alt={product.productTitle} className={'product-image'} />
					<Stack className={`hover-actions ${isHovered ? 'visible' : ''}`}>
						<Box
							className={`action-icon ${isLiked ? 'liked' : ''}`}
							onClick={(event) => {
								stopPropagation(event);
								likeProductHandler?.(user, product._id);
							}}
						>
							{isLiked ? (
								<FavoriteIcon className={'icon'} />
							) : (
								<FavoriteBorderIcon className={'icon'} />
							)}
						</Box>
						<Tooltip title={isInCompare ? t('Remove from Compare') : t('Add to Compare')} arrow>
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
									openQuickView(product);
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

					{/* Rating summary (stars + count) */}
					<Stack className={'rating-section'} direction="row" alignItems="center" spacing={0.5}>
						{(() => {
							const ratingAverage = product.ratingAverage ?? product.productRank ?? 0;
							const ratingCount = product.ratingCount ?? 0;

							if (ratingCount > 0) {
								return (
									<>
										<Stack direction="row" spacing={0.25} alignItems="center">
											{[1, 2, 3, 4, 5].map((star) => (
												<StarIcon
													key={star}
													className={star <= Math.round(ratingAverage) ? 'star-icon filled' : 'star-icon empty'}
													fontSize="small"
												/>
											))}
										</Stack>
										<Typography variant="caption" className={'rating-count'}>
											({ratingCount})
										</Typography>
									</>
								);
							}

							return (
								<Typography variant="caption" className={'rating-count'}>
									{t('No ratings yet')}
								</Typography>
							);
						})()}
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
