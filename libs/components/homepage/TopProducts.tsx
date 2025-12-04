import React, { useRef, useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { useTranslation } from 'next-i18next';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ProductCard from '../common/ProductCard';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { GET_PRODUCTS, GET_FAVORITES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { useCart } from '../../hooks/useCart';
import 'swiper/css';
import 'swiper/css/navigation';

interface TopProductsProps {
	initialInput: ProductsInquiry;
}

const TopProducts = (props: TopProductsProps) => {
	const { initialInput } = props;
	const { t } = useTranslation('common');
	const swiperRef = useRef<any>(null);
	const { addToCart } = useCart();
	const [topProducts, setTopProducts] = useState<Product[]>([]);

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
			setTopProducts(data?.getProducts?.list);
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

	if (!topProducts) return null;

	const addToCartHandler = (productId: string) => {
		const productToAdd = topProducts.find((p) => p._id === productId);
		if (productToAdd) {
			addToCart(productToAdd, 1);
			sweetTopSmallSuccessAlert('Product added to cart').then();
		}
	};

	const compareHandler = (productId: number | string) => {
		console.log('Add to compare:', productId);
	};

	const quickViewHandler = (productId: number | string) => {
		console.log('Quick view:', productId);
	};

	return (
		<Stack className={'top-products'}>
			<Stack className={'container'}>
				<Stack className={'section-header'}>
					<Stack className={'title-section'}>
						<Typography variant="h2" className={'main-title'}>
							<span className={'title-highlight'}>{t('TOP')}</span> {t('PRODUCTS')}
						</Typography>
						<Typography variant="body1" className={'subtitle'}>
							{t('The best products of Carmoa')}
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
							{topProducts.map((product) => (
								<SwiperSlide key={product._id} className={'top-product-slide'}>
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
					</Box>
					<Box component={'div'} className={'switch-btn swiper-top-products-next'}>
						<ArrowBackIosNewIcon />
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

TopProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopProducts;

