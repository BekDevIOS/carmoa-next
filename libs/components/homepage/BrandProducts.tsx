import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import { themeVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../types/product/product.input';
import { Direction } from '../../enums/common.enum';
import { CarBrand } from '../../enums/product.enum';

interface Brand {
	id: number;
	name: string;
	imageLight: string;
	imageDark: string;

}

interface BrandProductsProps {
	brands?: Brand[];
}

const BrandProducts = ({ brands }: BrandProductsProps) => {
	const themeMode = useReactiveVar(themeVar);
	const router = useRouter();
	const defaultBrands: Brand[] = [
		{
			id: 1,
			name: 'HYUNDAI',
			imageLight: '/img/brand/hyundai-seeklogo.png',
			imageDark: '/img/brand/hyundai-seeklogo.png',
		},
		{
			id: 2,
			name: 'KIA',
			imageLight: '/img/brand/kia-new-2021-seeklogo.png',
			imageDark: '/img/brand/kia-new-2021-seeklogoDARK.png',
		},
		{
			id: 3,
			name: 'GENESIS',
			imageLight: '/img/brand/image.png',
			imageDark: '/img/brand/image.png',
		},
		{
			id: 4,
			name: 'BMW',
			imageLight: '/img/brand/bmw-seeklogo.png',
			imageDark: '/img/brand/bmw-seeklogo.png',
		},
		{
			id: 5,
			name: 'MERCEDES',
			imageLight: '/img/brand/mercedes-benz-seeklogo.png',
			imageDark: '/img/brand/mercedes-benz-seeklogo.png',
		},
		{
			id: 6,
			name: 'AUDI',
			imageLight: '/img/brand/audi-seeklogo.png',
			imageDark: '/img/brand/audi-seeklogo.png',
		},
		{
			id: 7,
			name: 'VOLKSWAGEN',
			imageLight: '/img/brand/volkswagen-seeklogo.png',
			imageDark: '/img/brand/volkswagen-seeklogo.png',
		},
		{
			id: 8,
			name: 'TOYOTA',
			imageLight: '/img/brand/toyota-seeklogo.png',
			imageDark: '/img/brand/toyota-seeklogo.png',
		},
		{
			id: 9,
			name: 'HONDA',
			imageLight: '/img/brand/honda-silver-seeklogo.png',
			imageDark: '/img/brand/honda-silver-seeklogo.png',
		},
		{
			id: 10,
			name: 'CHEVROLET',
			imageLight: '/img/brand/chevrolet-seeklogo.png',
			imageDark: '/img/brand/chevrolet-seeklogo.png',
		},
	];

	const displayBrands = brands || defaultBrands;

	const handleBrandClick = async (brandName: string) => {
		try {
			// Map brand name to CarBrand enum
			const brandEnum = brandName.toUpperCase() as CarBrand;
			
			const searchInput: ProductsInquiry = {
				page: 1,
				limit: 9,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					brandList: [brandEnum],
				},
			};

			const queryString = JSON.stringify(searchInput);
			await router.push(`/product?input=${queryString}`);
		} catch (err: any) {
			console.log('ERROR, handleBrandClick:', err);
		}
	};

	const viewAllHandler = async () => {
		await router.push('/product');
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
						<Box
							key={brand.id}
							className={'brand-card'}
							onClick={() => handleBrandClick(brand.name)}
							sx={{ cursor: 'pointer' }}
						>
							<Box className={'brand-image-wrapper'}>
								<img
									src={themeMode === 'dark' ? brand.imageDark : brand.imageLight}
									alt={brand.name}
									className={'brand-image'}
								/>
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

