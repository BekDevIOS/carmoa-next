import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Stack, Typography, Box } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import FeaturedProductCard, { Product } from './FeaturedProductCard';
import 'swiper/css';

interface FeaturedProductsProps {
	latestProducts?: Product[];
	mostViewedProducts?: Product[];
	onSaleProducts?: Product[];
}

const FeaturedProducts = ({ latestProducts, mostViewedProducts, onSaleProducts }: FeaturedProductsProps) => {
	const latestSwiperRef = useRef<any>(null);
	const mostViewedSwiperRef = useRef<any>(null);
	const onSaleSwiperRef = useRef<any>(null);

	const defaultLatestProducts: Product[] = [
		{
			id: 1,
			image: '/img/product/image1.png',
			title: 'Swatch Variation Image',
			priceRange: { min: 49.0, max: 69.0 },
			discount: 17,
		},
		{
			id: 2,
			image: '/img/product/image2.png',
			title: 'Tatis Et Quasi',
			salePrice: 340.0,
		},
		{
			id: 3,
			image: '/img/product/image1.png',
			title: 'Ut Labore Et Do',
			priceRange: { min: 50.0, max: 70.0 },
		},
		{
			id: 4,
			image: '/img/product/image2.png',
			title: 'Odit Aut Fugit',
			salePrice: 50.0,
			originalPrice: 60.0,
		},
		{
			id: 13,
			image: '/img/product/image1.png',
			title: 'Dolorem Ipsum Quia',
			salePrice: 120.0,
		},
		{
			id: 14,
			image: '/img/product/image2.png',
			title: 'Sit Amet Consectetur',
			priceRange: { min: 80.0, max: 100.0 },
		},
		{
			id: 15,
			image: '/img/product/image1.png',
			title: 'Adipisci Velit Sed',
			salePrice: 95.0,
			originalPrice: 110.0,
		},
		{
			id: 16,
			image: '/img/product/image2.png',
			title: 'Quis Autem Vel',
			salePrice: 75.0,
		},
	];

	const defaultMostViewedProducts: Product[] = [
		{
			id: 5,
			image: '/img/product/image1.png',
			title: 'Ut Enim Ad Mini',
			salePrice: 70.0,
		},
		{
			id: 6,
			image: '/img/product/image2.png',
			title: 'Ut Labore Et Do',
			priceRange: { min: 50.0, max: 70.0 },
		},
		{
			id: 7,
			image: '/img/product/image1.png',
			title: 'Ex Ea Com Modi',
			salePrice: 70.0,
		},
		{
			id: 8,
			image: '/img/product/image2.png',
			title: 'Nisi Ut Aliqu',
			priceRange: { min: 60.0, max: 70.0 },
		},
		{
			id: 17,
			image: '/img/product/image1.png',
			title: 'Eum Iure Reprehenderit',
			salePrice: 85.0,
		},
		{
			id: 18,
			image: '/img/product/image2.png',
			title: 'Quis Nostrum Exercitationem',
			priceRange: { min: 90.0, max: 120.0 },
		},
		{
			id: 19,
			image: '/img/product/image1.png',
			title: 'Neque Porro Quisquam',
			salePrice: 65.0,
			originalPrice: 80.0,
		},
		{
			id: 20,
			image: '/img/product/image2.png',
			title: 'Est Qui Dolorem',
			salePrice: 110.0,
		},
	];

	const defaultOnSaleProducts: Product[] = [
		{
			id: 9,
			image: '/img/product/image1.png',
			title: 'Quia Voluptas Sit',
			salePrice: 150.0,
			originalPrice: 200.0,
			discount: 43,
		},
		{
			id: 10,
			image: '/img/product/image2.png',
			title: 'Labore Et Dolore',
			salePrice: 60.0,
			originalPrice: 89.0,
		},
		{
			id: 11,
			image: '/img/product/image1.png',
			title: 'Odit Aut Fugit',
			salePrice: 50.0,
			originalPrice: 60.0,
		},
		{
			id: 12,
			image: '/img/product/image2.png',
			title: 'Ipsa Quae Ab Illo',
			salePrice: 50.0,
			originalPrice: 88.0,
		},
		{
			id: 21,
			image: '/img/product/image1.png',
			title: 'Magnam Aliquam Quaerat',
			salePrice: 130.0,
			originalPrice: 180.0,
			discount: 28,
		},
		{
			id: 22,
			image: '/img/product/image2.png',
			title: 'Voluptatem Accusantium',
			salePrice: 75.0,
			originalPrice: 95.0,
		},
		{
			id: 23,
			image: '/img/product/image1.png',
			title: 'Doloremque Laudantium',
			salePrice: 45.0,
			originalPrice: 65.0,
		},
		{
			id: 24,
			image: '/img/product/image2.png',
			title: 'Totam Rem Aperiam',
			salePrice: 90.0,
			originalPrice: 130.0,
			discount: 31,
		},
	];

	const displayLatestProducts = latestProducts || defaultLatestProducts;
	const displayMostViewedProducts = mostViewedProducts || defaultMostViewedProducts;
	const displayOnSaleProducts = onSaleProducts || defaultOnSaleProducts;

	const addToCartHandler = (productId: number) => {
		console.log('Add to cart:', productId);
	};

	const wishlistHandler = (productId: number) => {
		console.log('Add to wishlist:', productId);
	};

	const compareHandler = (productId: number) => {
		console.log('Add to compare:', productId);
	};

	return (
		<Stack className={'featured-products'}>
			<Stack className={'container'}>
				<Stack className={'products-columns'}>
					{/* Latest Products Column */}
					<Stack className={'product-column'}>
						<Stack className={'column-header'}>
							<Stack
								sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
							>
								<Typography variant="h2" className={'column-title'}>
									LATEST PRODUCTS
								</Typography>{' '}
								<Stack className={'swiper-nav-buttons'}>
									<Box
										className={'swiper-nav-btn swiper-nav-prev'}
										onClick={() => latestSwiperRef.current?.slidePrev()}
									>
										<WestIcon />
									</Box>
									<Box
										className={'swiper-nav-btn swiper-nav-next'}
										onClick={() => latestSwiperRef.current?.slideNext()}
									>
										<EastIcon />
									</Box>
								</Stack>
							</Stack>
							<Box className={'title-underline'} />
						</Stack>
						<Box className={'swiper-wrapper'}>
							<Swiper
								direction={'vertical'}
								spaceBetween={8}
								slidesPerView={4}
								onSwiper={(swiper) => {
									latestSwiperRef.current = swiper;
								}}
								className={'featured-products-swiper'}
							>
								{displayLatestProducts.map((product) => (
									<SwiperSlide key={product.id} className={'featured-product-slide'}>
										<Box className={'slide-content'}>
											<FeaturedProductCard
												product={product}
												addToCartHandler={addToCartHandler}
												wishlistHandler={wishlistHandler}
												compareHandler={compareHandler}
											/>
										</Box>
									</SwiperSlide>
								))}
							</Swiper>
						</Box>
					</Stack>

					{/* Most Viewed Products Column */}
					<Stack className={'product-column'}>
						<Stack className={'column-header'}>
							<Stack
								sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
							>
								<Typography variant="h2" className={'column-title'}>
									MOST VIEWED
								</Typography>
								<Stack className={'swiper-nav-buttons'}>
									<Box
										className={'swiper-nav-btn swiper-nav-prev'}
										onClick={() => mostViewedSwiperRef.current?.slidePrev()}
									>
										<WestIcon />
									</Box>
									<Box
										className={'swiper-nav-btn swiper-nav-next'}
										onClick={() => mostViewedSwiperRef.current?.slideNext()}
									>
										<EastIcon />
									</Box>
								</Stack>
							</Stack>
							<Box className={'title-underline'} />
						</Stack>
						<Box className={'swiper-wrapper'}>
							<Swiper
								direction={'vertical'}
								spaceBetween={20}
								slidesPerView={4}
								onSwiper={(swiper) => {
									mostViewedSwiperRef.current = swiper;
								}}
								className={'featured-products-swiper'}
							>
								{displayMostViewedProducts.map((product) => (
									<SwiperSlide key={product.id} className={'featured-product-slide'}>
										<Box className={'slide-content'}>
											<FeaturedProductCard
												product={product}
												addToCartHandler={addToCartHandler}
												wishlistHandler={wishlistHandler}
												compareHandler={compareHandler}
											/>
										</Box>
									</SwiperSlide>
								))}
							</Swiper>
						</Box>
					</Stack>

					{/* On Sale Products Column */}
					<Stack className={'product-column'}>
						<Stack className={'column-header'}>
							<Stack
								sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
							>
								<Typography variant="h2" className={'column-title'}>
									ON SALE PRODUCTS
								</Typography>
								<Stack className={'swiper-nav-buttons'}>
									<Box
										className={'swiper-nav-btn swiper-nav-prev'}
										onClick={() => mostViewedSwiperRef.current?.slidePrev()}
									>
										<WestIcon />
									</Box>
									<Box
										className={'swiper-nav-btn swiper-nav-next'}
										onClick={() => mostViewedSwiperRef.current?.slideNext()}
									>
										<EastIcon />
									</Box>
								</Stack>
							</Stack>
							<Box className={'title-underline'} />
						</Stack>
						<Box className={'swiper-wrapper'}>
							<Swiper
								direction={'vertical'}
								spaceBetween={20}
								slidesPerView={4}
								onSwiper={(swiper) => {
									onSaleSwiperRef.current = swiper;
								}}
								className={'featured-products-swiper'}
							>
								{displayOnSaleProducts.map((product) => (
									<SwiperSlide key={product.id} className={'featured-product-slide'}>
										<Box className={'slide-content'}>
											<FeaturedProductCard
												product={product}
												addToCartHandler={addToCartHandler}
												wishlistHandler={wishlistHandler}
												compareHandler={compareHandler}
											/>
										</Box>
									</SwiperSlide>
								))}
							</Swiper>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default FeaturedProducts;
