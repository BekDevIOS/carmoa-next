import React from 'react';
import { Stack, Typography, Box } from '@mui/material';

interface Brand {
	id: number;
	name: string;
	image: string;
}

interface BrandProductsProps {
	brands?: Brand[];
}

const BrandProducts = ({ brands }: BrandProductsProps) => {
	const defaultBrands: Brand[] = [
		{
			id: 1,
			name: 'Land Rover',
			image: '/img/brand/bmw.png',
		},
		{
			id: 2,
			name: 'Nissan',
			image: '/img/brand/kia.png',
		},
		{
			id: 3,
			name: 'Toyota',
			image: '/img/brand/bmw.png',
		},
		{
			id: 4,
			name: 'Bentley',
			image: '/img/brand/kia.png',
		},
		{
			id: 5,
			name: 'Chevrolet',
			image: '/img/brand/bmw.png',
		},
		{
			id: 6,
			name: 'Mitsubishi',
			image: '/img/brand/kia.png',
		},
		{
			id: 7,
			name: 'Subaru',
			image: '/img/brand/bmw.png',
		},
		{
			id: 8,
			name: 'Volkswagen',
			image: '/img/brand/kia.png',
		},
		{
			id: 9,
			name: 'BMW',
			image: '/img/brand/bmw.png',
		},
		{
			id: 10,
			name: 'Ford',
			image: '/img/brand/kia.png',
		},
	];

	const displayBrands = brands || defaultBrands;

	const viewAllHandler = () => {
		console.log('View all brands');
	};

	return (
		<Stack className={'brand-products'}>
			<Stack className={'container'}>
				<Stack className={'section-header'}>
					<Typography variant="h2" className={'main-title'}>
						SHOP BY <span className={'brand-title'}>BRAND</span>
					</Typography>
					<Typography variant="body1" className={'subtitle'}>
					PREMIUM AUTOMOTIVE BRANDS
					</Typography>
				</Stack>
				<Stack className={'brands-grid'}>
					{displayBrands.map((brand) => (
						<Box key={brand.id} className={'brand-card'}>
							<Box className={'brand-image-wrapper'}>
								<img src={brand.image} alt={brand.name} className={'brand-image'} />
							</Box>
						</Box>
					))}
				</Stack>
				<Box className={'view-all-btn'} onClick={viewAllHandler}>
					<Typography variant="body1" className={'view-all-text'}>
						VIEW ALL
					</Typography>
				</Box>
			</Stack>
		</Stack>
	);
};

export default BrandProducts;

