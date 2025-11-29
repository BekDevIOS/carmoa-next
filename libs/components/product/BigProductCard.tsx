import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, Chip, IconButton, OutlinedInput, Stack, Tooltip, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { useCompare } from '../../hooks/useCompare';

interface BigProductCardProps {
	product: Product;
	likeProductHandler?: (user: any, id: string) => void;
	addToCartHandler?: (id: string) => void;
	compareHandler?: (id: string) => void;
	quickViewHandler?: (id: string) => void;
}

const BigProductCard = ({
	product,
	likeProductHandler,
	addToCartHandler,
	compareHandler,
	quickViewHandler,
}: BigProductCardProps) => {
	const user = useReactiveVar(userVar);
	const { isCompared, toggleCompare } = useCompare();
	const [quantity, setQuantity] = useState(1);
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const imageSwiperRef = useRef<any>(null);
	const isFavorite = Boolean(product?.meLiked && product?.meLiked[0]?.myFavorite);
	const isInCompare = isCompared(product._id);

	const getImageSrc = (img?: string) => {
		if (!img) return '/img/banner/header1.svg';
		if (img.startsWith('http') || img.startsWith('/img')) return img;
		return `${REACT_APP_API_URL}/${img}`;
	};

	const displayedImages = product?.productImages?.length ? product.productImages : ['/img/banner/header1.svg'];
	const showNavButtons = displayedImages.length > 1;

	const handleImagePrev = () => {
		if (imageSwiperRef.current) imageSwiperRef.current.slidePrev();
	};

	const handleImageNext = () => {
		if (imageSwiperRef.current) imageSwiperRef.current.slideNext();
	};

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity >= 1) {
			setQuantity(newQuantity);
		}
	};

	const handleAddToCart = () => {
		if (addToCartHandler) {
			addToCartHandler(product._id);
		}
	};

	const priceInfo = useMemo(() => {
		const hasSale = Boolean(product.productSalePrice && product.productSalePrice > 0);
		const regularPrice = typeof product.productPrice === 'number' ? product.productPrice : null;
		const salePrice = hasSale && typeof product.productSalePrice === 'number' ? product.productSalePrice : null;
		return {
			hasSale,
			salePrice,
			regularPrice,
			discountPercentage:
				hasSale && regularPrice && salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : null,
		};
	}, [product.productPrice, product.productSalePrice]);

	return (
		<Stack className={'big-product-card'}>
			<Box className={'big-card-image'}>
				{typeof priceInfo.discountPercentage === 'number' && (
					<Box className={'big-card-sale-chip'} component={'div'}>
						-{priceInfo.discountPercentage}%
					</Box>
				)}
				{showNavButtons && (
					<>
						<IconButton className={'vertical-nav-btn top'} onClick={handleImagePrev}>
							<KeyboardArrowUpIcon fontSize="small" />
						</IconButton>
						<IconButton className={'vertical-nav-btn bottom'} onClick={handleImageNext}>
							<KeyboardArrowDownIcon fontSize="small" />
						</IconButton>
					</>
				)}
				<Swiper
					direction="vertical"
					slidesPerView={1}
					centeredSlides
					spaceBetween={12}
					className={'big-card-image-swiper'}
					onSwiper={(swiper) => {
						imageSwiperRef.current = swiper;
						setActiveImageIndex(swiper.realIndex);
					}}
					onSlideChange={(swiper) => setActiveImageIndex(swiper.realIndex)}
				>
					{displayedImages.map((img, idx) => (
						<SwiperSlide key={`${product._id}-img-${idx}`} className={activeImageIndex === idx ? 'active' : ''}>
							<img
								src={getImageSrc(img)}
								alt={`${product.productTitle}-${idx}`}
								onClick={() => quickViewHandler?.(product._id)}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</Box>

			<Stack className={'big-card-content'}>
				{/* Product Title */}
				<Typography className={'big-card-title'}>{product.productTitle}</Typography>

				{/* Brands */}
				{product.productCarBrand && (
					<Stack className={'brands-section'}>
						<Stack direction={'row'} spacing={1} flexWrap={'wrap'} alignItems={'center'}>
							<Typography className={'brands-label'}>Brands:</Typography>
							<Chip label={product.productCarBrand} className={'brand-chip'} />
						</Stack>
					</Stack>
				)}

				{/* Social Proof - Views and Sold */}
				<Stack className={'social-proof'}>
					<Stack direction={'row'} spacing={2} flexWrap={'wrap'}>
						{product.productViews !== undefined && (
							<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
								<RemoveRedEyeIcon className={'view-icon'} />
								<Typography className={'viewers-count'}>{product.productViews} views</Typography>
							</Stack>
						)}
						{product.productLikes !== undefined && (
							<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
								<LocalFireDepartmentIcon className={'fire-icon'} />
								<Typography className={'sold-count'}>{product.productLikes} sold</Typography>
							</Stack>
						)}
					</Stack>
					{product.productStock !== undefined && product.productStock > 0 && (
						<Stack direction={'row'} alignItems={'center'} spacing={1} className={'social-proof-item'}>
							<CheckCircleIcon className={'stock-icon'} />
							<Typography className={'stock-status'}>In stock</Typography>
						</Stack>
					)}
				</Stack>

				{/* Description */}
				{product.productDescription && (
					<Typography className={'big-card-description'}>{product.productDescription}</Typography>
				)}

				{/* Pricing */}
				<Stack className={'big-card-prices'}>
					{typeof priceInfo.regularPrice === 'number' && priceInfo.hasSale && (
						<Typography
							className={'big-card-regular-price strike'}
							sx={{ fontSize: '18px', fontWeight: 500}}
						>
							${priceInfo.regularPrice.toFixed(2)}
						</Typography>
					)}
					{typeof priceInfo.salePrice === 'number' ? (
						<Typography className={'big-card-sale-price'}>${priceInfo.salePrice.toFixed(2)}</Typography>
					) : typeof priceInfo.regularPrice === 'number' ? (
						<Typography className={'big-card-regular-price'} sx={{ fontSize: '28px', fontWeight: 700 }}>
							${priceInfo.regularPrice.toFixed(2)}
						</Typography>
					) : null}
				</Stack>

				{/* Quantity Selector & Action Buttons */}
				<Stack className={'quantity-and-actions'} direction={'row'} alignItems={'center'} spacing={2}>
					<Stack className={'quantity-section'}>
						<Typography className={'quantity-label'}>Quantity:</Typography>
						<Stack direction={'row'} alignItems={'center'} className={'quantity-controls'}>
							<Button
								variant="outlined"
								onClick={() => handleQuantityChange(quantity - 1)}
								disabled={quantity <= 1}
								className={'quantity-btn'}
							>
								-
							</Button>
							<OutlinedInput
								type="number"
								value={quantity}
								onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
								className={'quantity-input'}
								inputProps={{ min: 1 }}
							/>
							<Button variant="outlined" onClick={() => handleQuantityChange(quantity + 1)} className={'quantity-btn'}>
								+
							</Button>
						</Stack>
					</Stack>
					<Button className={'add-to-cart-btn'} onClick={handleAddToCart} startIcon={<ShoppingCartOutlinedIcon />}>
						ADD TO CART
					</Button>
					<IconButton className={'wishlist-btn'} onClick={() => likeProductHandler?.(user, product._id)}>
						{isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
					<IconButton
						className={'compare-btn'}
						onClick={() => {
							toggleCompare(product);
							compareHandler?.(product._id);
						}}
					>
						<CompareArrowsIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default BigProductCard;
