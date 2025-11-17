import React, { useRef } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TopProductCard from './TopProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
	id: number;
	image: string;
	category: string;
	title: string;
	originalPrice?: number;
	salePrice: number;
	discount?: number;
}

const TopProducts = () => {
	const swiperRef = useRef<any>(null);

	const products: Product[] = [
		{
			id: 1,
			image: '/img/product/image1.png',
			category: 'Accessories',
			title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
			originalPrice: 275.0,
			salePrice: 200.0,
			discount: 27,
		},
		{
			id: 2,
			image: '/img/product/image2.png',
			category: 'Accessories',
			title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
			originalPrice: 275.0,
			salePrice: 200.0,
			discount: 27,
		},
		{
			id: 3,
			image: '/img/product/image1.png',
			category: 'Accessories',
			title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
			originalPrice: 275.0,
			salePrice: 200.0,
			discount: 27,
		},
		{
			id: 4,
			image: '/img/product/image2.png',
			category: 'Accessories',
			title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
			originalPrice: 275.0,
			salePrice: 200.0,
			discount: 27,
		},
		{
			id: 5,
			image: '/img/product/image1.png',
			category: 'Accessories',
			title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
			originalPrice: 275.0,
			salePrice: 200.0,
			discount: 27,
		},
		{
			id: 6,
			image: '/img/product/image2.png',
			category: 'Accessories',
			title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
			originalPrice: 275.0,
			salePrice: 200.0,
			discount: 27,
		},
		{
			id: 7,
			image: '/img/product/image1.png',
			category: 'Accessories',
			title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
			originalPrice: 275.0,
			salePrice: 200.0,
			discount: 27,
		},
		{
			id: 8,
			image: '/img/product/image2.png',
			category: 'Accessories',
			title: 'Astro 4 Portable Tire Inflator Air compressor Easy',
			originalPrice: 275.0,
			salePrice: 200.0,
			discount: 27,
		},
	];

	const addToCartHandler = (productId: number) => {
		console.log('Add to cart:', productId);
	};

	const wishlistHandler = (productId: number) => {
		console.log('Add to wishlist:', productId);
	};

	const compareHandler = (productId: number) => {
		console.log('Add to compare:', productId);
	};

	const quickViewHandler = (productId: number) => {
		console.log('Quick view:', productId);
	};

	return (
		<Stack className={'top-products'}>
			<Stack className={'container'}>
				<Stack className={'section-header'}>
					<Stack className={'title-section'}>
						<Typography variant="h2" className={'main-title'}>
							<span className={'title-highlight'}>TOP</span> PRODUCTS
						</Typography>
						<Typography variant="body1" className={'subtitle'}>
							The best products of Carmoa
						</Typography>
					</Stack>
				</Stack>
				<Stack className={'products-wrapper'}>
					<Box component={'div'} className={'switch-btn swiper-top-products-prev'}>
						<ArrowBackIosNewIcon />
					</Box>
					<Box component={'div'} className={'swiper-container'}>
						<Swiper
							className={'top-products-swiper'}
							slidesPerView={4}
							spaceBetween={24}
							modules={[Navigation]}
							navigation={{
								nextEl: '.swiper-top-products-next',
								prevEl: '.swiper-top-products-prev',
							}}
							onSwiper={(swiper) => {
								swiperRef.current = swiper;
							}}
						>
							{products.map((product) => (
								<SwiperSlide key={product.id} className={'top-product-slide'}>
									<TopProductCard
										product={product}
										addToCartHandler={addToCartHandler}
										wishlistHandler={wishlistHandler}
										compareHandler={compareHandler}
										quickViewHandler={quickViewHandler}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					</Box>
					<Box component={'div'} className={'switch-btn swiper-top-products-next'}>
						<ArrowBackIosNewIcon />
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default TopProducts;

