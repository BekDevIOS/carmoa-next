import React from 'react';
import { Stack, Typography } from '@mui/material';
import ProductCard from '../common/ProductCard';

const TrendProducts = () => {
	const products = [
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
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							addToCartHandler={addToCartHandler}
							wishlistHandler={wishlistHandler}
							compareHandler={compareHandler}
							quickViewHandler={quickViewHandler}
						/>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default TrendProducts;
