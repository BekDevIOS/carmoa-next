import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Stack, Typography, Box } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import FeaturedProductCard from './FeaturedProductCard';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { userVar } from '../../../apollo/store';
import { useCart } from '../../hooks/useCart';
import 'swiper/css';

interface FeaturedProductsProps {
	latestInput?: ProductsInquiry;
	mostViewedInput?: ProductsInquiry;
	onSaleInput?: ProductsInquiry;
}

const FeaturedProducts = ({ latestInput, mostViewedInput, onSaleInput }: FeaturedProductsProps) => {
	const latestSwiperRef = useRef<any>(null);
	const mostViewedSwiperRef = useRef<any>(null);
	const onSaleSwiperRef = useRef<any>(null);
	const user = useReactiveVar(userVar);
	const { addToCart } = useCart();

	const [latestProducts, setLatestProducts] = useState<Product[]>([]);
	const [mostViewedProducts, setMostViewedProducts] = useState<Product[]>([]);
	const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	// Latest Products Query
	const {
		loading: latestLoading,
		data: latestData,
		refetch: latestRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: latestInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setLatestProducts(data?.getProducts?.list || []);
		},
	});

	// Most Viewed Products Query
	const {
		loading: mostViewedLoading,
		data: mostViewedData,
		refetch: mostViewedRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: mostViewedInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMostViewedProducts(data?.getProducts?.list || []);
		},
	});

	// On Sale Products Query
	const {
		loading: onSaleLoading,
		data: onSaleData,
		refetch: onSaleRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: onSaleInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setOnSaleProducts(data?.getProducts?.list || []);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({
				variables: { input: id },
			});

			// Refetch all queries to update like status
			await Promise.all([
				latestRefetch({ input: latestInput }),
				mostViewedRefetch({ input: mostViewedInput }),
				onSaleRefetch({ input: onSaleInput }),
			]);

			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const addToCartHandler = (productId: string) => {
		// Find product in any of the three lists
		const productToAdd = 
			latestProducts.find((p) => p._id === productId) ||
			mostViewedProducts.find((p) => p._id === productId) ||
			onSaleProducts.find((p) => p._id === productId);
		
		if (productToAdd) {
			addToCart(productToAdd, 1);
			sweetTopSmallSuccessAlert('Product added to cart').then();
		}
	};

	const wishlistHandler = (productId: string) => {
		likeProductHandler(user, productId);
	};

	const compareHandler = (productId: string) => {
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
								{latestProducts.map((product) => (
									<SwiperSlide key={product._id} className={'featured-product-slide'}>
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
								{mostViewedProducts.map((product) => (
									<SwiperSlide key={product._id} className={'featured-product-slide'}>
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
										onClick={() => onSaleSwiperRef.current?.slidePrev()}
									>
										<WestIcon />
									</Box>
									<Box
										className={'swiper-nav-btn swiper-nav-next'}
										onClick={() => onSaleSwiperRef.current?.slideNext()}
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
								{onSaleProducts.map((product) => (
									<SwiperSlide key={product._id} className={'featured-product-slide'}>
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

FeaturedProducts.defaultProps = {
	latestInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
	mostViewedInput: {
		page: 1,
		limit: 8,
		sort: 'productViews',
		direction: 'DESC',
		search: {},
	},
	onSaleInput: {
		page: 1,
		limit: 8,
		sort: 'productLikes',
		direction: 'DESC',
		search: {
			onSale: true,
		},
	},
};

export default FeaturedProducts;
