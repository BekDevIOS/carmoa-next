import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCard } from '../mypage/ProductCard';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { userVar } from '../../../apollo/store';

const MemberProducts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>({ ...initialInput });
	const [memberProducts, setMemberProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberProductsLoading,
		data: getMemberProductsData,
		error: getMemberProductsError,
		refetch: getMemberProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberProducts(data?.getProducts?.list || []);
			setTotal(data?.getProducts?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const targetMemberId = (memberId as string) || (user?._id as string);
		if (!targetMemberId) return;

		setSearchFilter((prev) => ({
			...prev,
			search: {
				...(prev.search || {}),
				memberId: targetMemberId,
			},
		}));
	}, [memberId, user?._id]);

	useEffect(() => {
		if (!searchFilter?.search?.memberId) return;
		getMemberProductsRefetch({ input: searchFilter }).then();
	}, [searchFilter, getMemberProductsRefetch]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter((prev) => ({
			...prev,
			page: value,
		}));
	};

	if (device === 'mobile') {
		return <div>MEMBER PRODUCTS MOBILE</div>;
	} else {
		return (
			<div id="member-products-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Products</Typography>
					</Stack>
				</Stack>
				<Stack className="properties-list-box">
					<Stack className="list-box">
						{memberProducts?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Product Title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">Views</Typography>
							</Stack>
						)}
						{memberProducts?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Products found!</p>
							</div>
						)}
						{memberProducts?.map((product: Product) => {
							return <ProductCard product={product} memberPage={true} key={product?._id} />;
						})}

						{memberProducts.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / (searchFilter.limit || 5))}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>
										{total} product
										{total !== 1 ? 's' : ''} available
									</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MemberProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			memberId: '',
		},
	},
};

export default MemberProducts;
