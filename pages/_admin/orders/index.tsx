import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Stack, CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import { OrderPanelList } from '../../../libs/components/admin/orders/OrderList';
import { Order } from '../../../libs/types/order/order';
import { OrdersInquiry } from '../../../libs/types/order/order.input';
import { OrderStatus, PaymentStatus } from '../../../libs/enums/order.enum';
import { AdminOrderUpdate } from '../../../libs/types/order/order.update';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_ORDER_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ORDERS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const AdminOrders: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [ordersInquiry, setOrdersInquiry] = useState<OrdersInquiry>(initialInquiry);
	const [orders, setOrders] = useState<Order[]>([]);
	const [ordersTotal, setOrdersTotal] = useState<number>(0);
	const [statusFilter, setStatusFilter] = useState<string>(
		ordersInquiry?.search?.orderStatus ? ordersInquiry?.search?.orderStatus : 'ALL'
	);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [updateOrderByAdmin] = useMutation(UPDATE_ORDER_BY_ADMIN);

	const {
		loading: getOrdersLoading,
		data: getOrdersData,
		error: getOrdersError,
		refetch: getOrdersRefetch,
	} = useQuery(GET_ORDERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: ordersInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setOrders(data?.getOrdersByAdmin?.list || []);
			setOrdersTotal(data?.getOrdersByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getOrdersRefetch({ input: ordersInquiry }).then();
	}, [ordersInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		ordersInquiry.page = newPage + 1;
		await getOrdersRefetch({ input: ordersInquiry });
		setOrdersInquiry({ ...ordersInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		ordersInquiry.limit = parseInt(event.target.value, 10);
		ordersInquiry.page = 1;
		await getOrdersRefetch({ input: ordersInquiry });
		setOrdersInquiry({ ...ordersInquiry });
	};

	const searchHandler = (value: string) => {
		setSearchText(value);
	};

	const statusFilterHandler = async (value: string) => {
		setStatusFilter(value);
		setOrdersInquiry({ ...ordersInquiry, page: 1, sort: 'createdAt' });

		if (value === 'ALL') {
			delete ordersInquiry?.search?.orderStatus;
			setOrdersInquiry({ ...ordersInquiry });
		} else if (value === 'CONFIRMED' || value === 'IN_DELIVERY') {
			// These are display-only filters, backend uses PROCESS
			// We'll filter client-side for these
			setOrdersInquiry({ ...ordersInquiry, search: { orderStatus: OrderStatus.PROCESS } });
		} else {
			setOrdersInquiry({ ...ordersInquiry, search: { orderStatus: value as OrderStatus } });
		}
	};

	const updateOrderHandler = async (updateData: AdminOrderUpdate) => {
		try {
			await updateOrderByAdmin({
				variables: {
					input: updateData,
				},
			});
			await getOrdersRefetch({ input: ordersInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const quickUpdateOrderStatusHandler = async (orderId: string, status: OrderStatus) => {
		try {
			await updateOrderByAdmin({
				variables: {
					input: {
						_id: orderId,
						orderStatus: status,
					},
				},
			});
			await getOrdersRefetch({ input: ordersInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const quickUpdatePaymentStatusHandler = async (orderId: string, status: PaymentStatus) => {
		try {
			await updateOrderByAdmin({
				variables: {
					input: {
						_id: orderId,
						paymentStatus: status,
					},
				},
			});
			await getOrdersRefetch({ input: ordersInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	// Client-side filtering for CONFIRMED and IN_DELIVERY (since backend uses PROCESS for both)
	let displayOrders = orders;
	
	// Apply status filter
	if (statusFilter === 'CONFIRMED') {
		displayOrders = displayOrders.filter(
			(order) => order.orderStatus === OrderStatus.PROCESS && (!order.shippingFee || order.shippingFee === 0)
		);
	} else if (statusFilter === 'IN_DELIVERY') {
		displayOrders = displayOrders.filter(
			(order) => order.orderStatus === OrderStatus.PROCESS && order.shippingFee !== undefined && order.shippingFee > 0
		);
	}
	
	// Client-side search filtering
	if (searchText.trim()) {
		const searchLower = searchText.toLowerCase();
		displayOrders = displayOrders.filter(
			(order) =>
				order._id.toLowerCase().includes(searchLower) ||
				order.memberData?.memberNick?.toLowerCase().includes(searchLower) ||
				order.memberData?.memberFullName?.toLowerCase().includes(searchLower) ||
				order.memberData?.memberPhone?.toLowerCase().includes(searchLower) ||
				order.memberData?.memberEmail?.toLowerCase().includes(searchLower) ||
				order.orderItems?.some(item => 
					item.productData?.productTitle?.toLowerCase().includes(searchLower)
				)
		);
	}

	return (
		<Box component={'div'} className={'content'}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '24px' }}>
				<Box>
					<Typography variant={'h2'} className={'tit'} sx={{ mb: '4px', fontSize: '28px', fontWeight: 700 }}>
						Order Management
					</Typography>
					<Typography variant={'body2'} sx={{ color: 'var(--carmo-text-secondary)', fontSize: '14px' }}>
						Manage and track all customer orders
					</Typography>
				</Box>
				<Box sx={{ 
					display: 'flex', 
					gap: 2, 
					p: 2, 
					backgroundColor: 'var(--carmo-bg-soft)', 
					borderRadius: '12px' 
				}}>
					<Box sx={{ textAlign: 'center' }}>
						<Typography variant={'caption'} sx={{ color: 'var(--carmo-text-secondary)', fontSize: '11px' }}>
							Total Orders
						</Typography>
						<Typography variant={'h6'} sx={{ fontWeight: 700, fontSize: '20px' }}>
							{ordersTotal}
						</Typography>
					</Box>
					<Box sx={{ textAlign: 'center', borderLeft: '1px solid var(--carmo-border)', pl: 2 }}>
						<Typography variant={'caption'} sx={{ color: 'var(--carmo-text-secondary)', fontSize: '11px' }}>
							Displaying
						</Typography>
						<Typography variant={'h6'} sx={{ fontWeight: 700, fontSize: '20px' }}>
							{displayOrders.length}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Box component={'div'} className={'table-wrap'} sx={{ 
				backgroundColor: 'var(--carmo-bg)', 
				borderRadius: '16px', 
				border: '1px solid var(--carmo-border)',
				overflow: 'hidden'
			}}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Stack 
						className={'search-area'} 
						direction="row" 
						justifyContent="space-between" 
						alignItems="center"
						sx={{ m: '20px', mb: '20px' }}
					>
						<Box sx={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
							<OutlinedInput
								value={searchText}
								onChange={(e: any) => searchHandler(e.target.value)}
								placeholder="Search by order ID, customer name, or phone..."
								sx={{ 
									width: '100%',
									height: '48px',
									background: 'var(--carmo-bg)',
									fontSize: '14px',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: 'var(--carmo-border)',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: 'var(--carmo-primary)',
									},
								}}
							/>
							{getOrdersLoading && (
								<CircularProgress 
									size={20} 
									sx={{ 
										position: 'absolute', 
										right: '12px', 
										top: '50%', 
										transform: 'translateY(-50%)' 
									}} 
								/>
							)}
						</Box>
						<Select 
							value={statusFilter}
							onChange={(e) => statusFilterHandler(e.target.value)}
							sx={{ 
								width: '180px',
								height: '48px',
								background: 'var(--carmo-bg)',
								fontSize: '14px',
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: 'var(--carmo-border)',
								},
								'&:hover .MuiOutlinedInput-notchedOutline': {
									borderColor: 'var(--carmo-primary)',
								},
							}}
						>
							<MenuItem value={'ALL'}>All Statuses</MenuItem>
							<MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
							<MenuItem value={'CONFIRMED'}>Confirmed</MenuItem>
							<MenuItem value={'IN_DELIVERY'}>In Delivery</MenuItem>
							<MenuItem value={OrderStatus.FINISHED}>Completed</MenuItem>
							<MenuItem value={OrderStatus.CANCELLED}>Cancelled</MenuItem>
						</Select>
					</Stack>
					<Divider />
					<OrderPanelList 
						orders={displayOrders} 
						updateOrderStatusHandler={quickUpdateOrderStatusHandler}
						updatePaymentStatusHandler={quickUpdatePaymentStatusHandler}
					/>
					<TablePagination
						rowsPerPageOptions={[10, 20, 40, 60]}
						component="div"
						count={statusFilter === 'CONFIRMED' || statusFilter === 'IN_DELIVERY' || searchText.trim() ? displayOrders.length : ordersTotal}
						rowsPerPage={ordersInquiry?.limit}
						page={ordersInquiry?.page - 1}
						onPageChange={changePageHandler}
						onRowsPerPageChange={changeRowsPerPageHandler}
					/>
				</Box>
			</Box>
		</Box>
	);
};

AdminOrders.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminOrders);

