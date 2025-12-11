import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import ProductCard from '../common/ProductCard';
import { ProductsInquiry } from '../../types/product/product.input';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { GET_PRODUCTS, GET_FAVORITES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { useCart } from '../../hooks/useCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';

interface TrendProductsProps {
	initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {

	const { initialInput } = props;
	const device = useDeviceDetect();
	const { addToCart } = useCart();
	const [trendProducts, setTrendProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({
				variables: { input: id },
				refetchQueries: [
					{
						query: GET_FAVORITES,
						variables: { input: { page: 1, limit: 1 } },
					},
				],
			});
			await getProductsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (trendProducts) console.log('trendProducts:', trendProducts);
	if (!trendProducts) return null;


	const addToCartHandler = (productId: string) => {
		const productToAdd = trendProducts.find((p) => p._id === productId);
		if (productToAdd) {
			addToCart(productToAdd, 1);
			sweetTopSmallSuccessAlert('Product added to cart').then();
		}
	};

	const wishlistHandler = (productId: string) => {
		console.log('Add to wishlist:', productId);
	};

	const compareHandler = (productId: string) => {
		console.log('Add to compare:', productId);
	};

	const quickViewHandler = (productId: string) => {
		console.log('Quick view:', productId);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trend-products mobile'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Stack className={'title-section'}>
							<Typography variant="h2" className={'main-title'}>
								<span className={'title-highlight'}>TREND</span> PRODUCTS
							</Typography>
						</Stack>
					</Stack>
					<Swiper
						className={'trend-products-swiper mobile'}
						slidesPerView={1.2}
						spaceBetween={16}
						centeredSlides={false}
						modules={[Autoplay]}
						autoplay={{ delay: 3000, disableOnInteraction: false }}
					>
						{trendProducts.map((product) => (
							<SwiperSlide key={product._id} className={'trend-product-slide'}>
								<ProductCard
									product={product}
									likeProductHandler={likeProductHandler}
									addToCartHandler={addToCartHandler}
									compareHandler={compareHandler}
									quickViewHandler={quickViewHandler}
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'trend-products'}>
			<Stack className={'container'}>
				<Stack className={'section-header'}>
					<Stack className={'title-section'}>
						<Typography variant="h2" className={'main-title'}>
							<span className={'title-highlight'}>TREND</span> PRODUCTS
						</Typography>
						<Typography variant="body1" className={'subtitle'}>
							The best products of Carmoa
						</Typography>
					</Stack>
				</Stack>
				<Stack className={'products-grid'}>
					{trendProducts.map((product) => (
						<ProductCard
							key={product._id}
							product={product}
							likeProductHandler={likeProductHandler}
							addToCartHandler={addToCartHandler}
							compareHandler={compareHandler}
							quickViewHandler={quickViewHandler}
						/>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

TrendProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productLikes',
		direction: 'DESC',
		search: { },
	},
};

export default TrendProducts;
