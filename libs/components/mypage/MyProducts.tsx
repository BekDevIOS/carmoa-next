import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCard } from './ProductCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Product } from '../../types/product/product';
import { DealerProductsInquiry } from '../../types/product/product.input';
import { T } from '../../types/common';
import { ProductStatus } from '../../enums/product.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { GET_DEALER_PRODUCTS } from '../../../apollo/user/query';
import { UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyProducts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<DealerProductsInquiry>(initialInput);
  const [dealerProducts, setDealerProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getDealerProductsLoading,
		data: getDealerProductsData,
		error: getDealerProductsError,
		refetch: getDealerProductsRefetch,
	} = useQuery(GET_DEALER_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setDealerProducts(data?.getDealerProducts?.list);
			setTotal(data?.getDealerProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: ProductStatus) => {
		setSearchFilter({ ...searchFilter, search: { productStatus: value } });
	};

	const deleteProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this property?')) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							propertyStatus: 'DELETE',
						},
					},
				});
				await getDealerProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateProductHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`are you sure change to ${status} status?`)) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							propertyStatus: status,
						},
					},
				});
				await getDealerProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'DEALER') {
		router.back();
		return null;
	}

	if (device === 'mobile') {
		return <div>MY PRODUCTS MOBILE</div>;
	} else {
		return (
			<div id="my-products-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Products</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="product-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.ACTIVE)}
							className={searchFilter.search.productStatus === ProductStatus.ACTIVE ? 'active-tab-name' : 'tab-name'}
						>
							Active
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.SOLD)}
							className={searchFilter.search.productStatus === ProductStatus.SOLD ? 'active-tab-name' : 'tab-name'}
						>
							Sold
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.HOLD)}
							className={searchFilter.search.productStatus === ProductStatus.HOLD ? 'active-tab-name' : 'tab-name'}
						>
							On Hold
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Product Title</Typography>
							<Typography className="title-text">Category</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">Views</Typography>
							<Typography className="title-text">Action</Typography>
						</Stack>

						{dealerProducts?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Products found!</p>
							</div>
						) : (
							dealerProducts.map((product: Product) => {
								return (
									<ProductCard
                  product={product}
                  deleteProductHandler={deleteProductHandler}
                  updateProductHandler={updateProductHandler}
									/>
								);
							})
						)}

						{dealerProducts.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} product{total !== 1 ? 's' : ''} available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			productStatus: ProductStatus.ACTIVE,
		},
	},
};

export default MyProducts;

