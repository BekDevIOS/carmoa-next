import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography, IconButton } from '@mui/material';
import ProductCard from '../../libs/components/common/ProductCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';

// export const getStaticProps = async ({ locale }: any) => ({
// 	props: {
// 		...(await serverSideTranslations(locale, ['common'])),
// 	},
// });

interface Product {
	id: number;
	image: string;
	category: string;
	title: string;
	originalPrice?: number;
	salePrice: number;
	discount?: number;
	compatibility?: string;
	condition?: 'New' | 'Used' | 'Refurbished';
	isSale?: boolean;
}

const ProductList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('Default sorting');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	// Sample products for demonstration
	useEffect(() => {
		// Replace with actual API call
		const sampleProducts: Product[] = [
			{
				id: 1,
				image: '/img/product/image1.png',
				category: 'Engine Parts',
				title: 'High Performance Engine Filter',
				originalPrice: 120,
				salePrice: 99.99,
				discount: 20,
				compatibility: 'Hyundai Avante 2016–2020',
				condition: 'New',
				isSale: true,
			},
			{
				id: 2,
				image: '/img/product/image2.png',
				category: 'Body Parts',
				title: 'Premium Car Bumper',
				salePrice: 299.99,
				compatibility: 'Toyota Camry 2018–2022',
				condition: 'New',
			},
			{
				id: 3,
				image: '/img/product/image1.png',
				category: 'Accessories',
				title: 'Luxury Car Seat Covers',
				originalPrice: 150,
				salePrice: 129.99,
				discount: 15,
				compatibility: 'Honda Accord 2015–2021',
				condition: 'Refurbished',
				isSale: true,
			},
		];
		setProducts(sampleProducts);
		setTotal(sampleProducts.length);
	}, []);

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/products?input=${JSON.stringify(searchFilter)}`,
			`/products?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'default':
				setFilterSortName('Default sorting');
				break;
			case 'new':
				setFilterSortName('New');
				break;
			case 'lowest':
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setFilterSortName('Highest Price');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>PRODUCTS MOBILE</h1>;
	} else {
		return (
			<div id="product-list-page">
				<div className="container">
					<Stack className={'product-page'}>
						{/* Left Sidebar - Filter */}
						<Stack className={'filter-config'}>
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>

						{/* Right Main Content */}
						<Stack className={`main-config ${viewMode}`}>
							{/* Hero Banner Image */}
							<Box className={'product-hero-image'}>
								<img src="/img/cars/image1.png" alt="Product Hero" />
							</Box>

							{/* Sorting and View Controls */}
							<Stack className={'product-controls'}>
								<Box className={'sorting-control'}>
									<Button
										onClick={sortingClickHandler}
										endIcon={<KeyboardArrowDownRoundedIcon />}
										className={'sort-btn'}
									>
										{filterSortName}
									</Button>
									<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
										<MenuItem onClick={sortingHandler} id={'default'} disableRipple>
											Default sorting
										</MenuItem>
										<MenuItem onClick={sortingHandler} id={'new'} disableRipple>
											New
										</MenuItem>
										<MenuItem onClick={sortingHandler} id={'lowest'} disableRipple>
											Lowest Price
										</MenuItem>
										<MenuItem onClick={sortingHandler} id={'highest'} disableRipple>
											Highest Price
										</MenuItem>
									</Menu>
								</Box>
								<Stack className={'view-controls'} direction={'row'} spacing={0}>
									<IconButton className={`view-btn grid-btn ${viewMode === 'grid' ? 'active' : ''}`}>
										<ViewModuleIcon />
									</IconButton>
									<IconButton className={`view-btn list-btn ${viewMode === 'list' ? 'active' : ''}`}>
										<ViewListIcon />
									</IconButton>
								</Stack>
							</Stack>

							{/* Product Grid/List */}
							<Stack className={'list-config'}>
								{products?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Products found!</p>
									</div>
								) : (
									products.map((product: Product) => {
										return (
											<ProductCard
												product={product}
												key={product.id}
												addToCartHandler={(id) => console.log('Add to cart:', id)}
												wishlistHandler={(id) => console.log('Add to wishlist:', id)}
												compareHandler={(id) => console.log('Add to compare:', id)}
												quickViewHandler={(id) => console.log('Quick view:', id)}
											/>
										);
									})
								)}
							</Stack>

							{/* Pagination */}
							<Stack className="pagination-config">
								{products.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / (searchFilter.limit || 9))}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{products.length !== 0 && (
									<Stack className="total-result">
										<Typography component="p">
											Total {total} product{total > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

ProductList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(ProductList);
