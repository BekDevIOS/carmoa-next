import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography, IconButton } from '@mui/material';
import ProductCard from '../../libs/components/common/ProductCard';
import BigProductCard from '../../libs/components/product/BigProductCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('Default sorting');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProducts(data?.getProducts?.list || []);
			setTotal(data?.getProducts?.metaCounter[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const storedMode = localStorage.getItem('productListViewMode');
		if (storedMode === 'grid' || storedMode === 'list') {
			setViewMode(storedMode);
		}
	}, []);

	useEffect(() => {
		console.log('searchFilter', searchFilter);
		// getProductsRefetch({ input: searchFilter }).then();
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/product?input=${JSON.stringify(searchFilter)}`,
			`/product?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({
				variables: { input: id },
			});
			await getProductsRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err);
			sweetMixinErrorAlert(err.message).then();
		}
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
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.DESC });
				setFilterSortName('Default sorting');
				break;
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.DESC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const handleViewModeChange = (mode: 'grid' | 'list') => {
		setViewMode(mode);
		if (typeof window !== 'undefined') {
			localStorage.setItem('productListViewMode', mode);
		}
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
									<IconButton
										className={`view-btn grid-btn ${viewMode === 'grid' ? 'active' : ''}`}
										onClick={() => handleViewModeChange('grid')}
										aria-label="Grid view"
									>
										<ViewModuleIcon />
									</IconButton>
									<IconButton
										className={`view-btn list-btn ${viewMode === 'list' ? 'active' : ''}`}
										onClick={() => handleViewModeChange('list')}
										aria-label="List view"
									>
										<ViewListIcon />
									</IconButton>
								</Stack>
							</Stack>

							{/* Product Grid/List */}
							<Stack className={'list-config'}>
								{products?.length === 0 ? (
									<Stack className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<Typography component="p">No Products found!</Typography>
									</Stack>
								) : (
									products.map((product: Product) => {
										return viewMode === 'grid' ? (
											<ProductCard
												product={product}
												key={product._id}
												likeProductHandler={likeProductHandler}
												addToCartHandler={(id: string) => console.log('Add to cart:', id)}
												compareHandler={(id: string) => console.log('Add to compare:', id)}
												quickViewHandler={(id: string) => console.log('Quick view:', id)}
											/>
										) : (
											<BigProductCard
												product={product}
												key={product._id}
												likeProductHandler={likeProductHandler}
												addToCartHandler={(id: string) => console.log('Add to cart:', id)}
												compareHandler={(id: string) => console.log('Add to compare:', id)}
												quickViewHandler={(id: string) => console.log('Quick view:', id)}
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
