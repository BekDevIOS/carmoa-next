import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Button, CircularProgress } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_MY_ORDERS } from '../../../apollo/user/query';
import { OrdersInquiry } from '../../types/order/order.input';
import { Order as OrderType } from '../../types/order/order';
import { OrderStatus } from '../../enums/order.enum';
import { Direction } from '../../enums/common.enum';

interface DisplayOrder {
	_id: string;
	orderNumber: string;
	date: string;
	status: string;
	total: number;
	itemCount: number;
}

const OrderTable: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchOrders, setSearchOrders] = useState<OrdersInquiry>({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	});

	/** APOLLO REQUESTS **/
	const {
		loading: ordersLoading,
		data: ordersData,
		error: ordersError,
		refetch: ordersRefetch,
	} = useQuery(GET_MY_ORDERS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchOrders,
		},
		notifyOnNetworkStatusChange: true,
	});

	// Map backend orders to display format
	const orders: DisplayOrder[] = useMemo(() => {
		if (!ordersData?.getMyOrders?.list) return [];

		return ordersData.getMyOrders.list.map((order: OrderType) => {
			// Format order status
			const formatStatus = (status: OrderStatus): string => {
				switch (status) {
					case OrderStatus.PENDING:
						return 'Pending';
					case OrderStatus.PROCESS:
						return 'Processing';
					case OrderStatus.FINISHED:
						return 'Completed';
					case OrderStatus.CANCELLED:
						return 'Cancelled';
					default:
						return status;
				}
			};

			// Format date
			const formatDate = (dateString: string | Date | undefined): string => {
				if (!dateString) return 'N/A';
				const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
				return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
			};

			// Calculate item count
			const itemCount = order.orderItems?.reduce((sum, item) => sum + item.itemQuantity, 0) || 0;

			// Use last 6 characters of _id as order number
			const orderNumber = order._id.slice(-6).toUpperCase();

			return {
				_id: order._id,
				orderNumber,
				date: formatDate(order.createdAt),
				status: formatStatus(order.orderStatus),
				total: order.totalPrice || 0,
				itemCount,
			};
		});
	}, [ordersData]);

	/** HANDLERS **/
	const viewOrderHandler = (orderId: string) => {
		router.push(`/order/detail?orderId=${orderId}`);
	};

	if (device === 'mobile') {
		return <div>ORDER TABLE MOBILE</div>;
	} else {
		return (
			<div id="order-table-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Orders</Typography>
						<Typography className="sub-title">Here are your recent orders</Typography>
					</Stack>
				</Stack>
				<Stack className="order-table-container">
					{ordersLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
							<CircularProgress />
						</Box>
					) : ordersError ? (
						<Box className="no-orders">
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>Error loading orders. Please try again.</p>
						</Box>
					) : (
						<Box className="order-table-wrapper">
							<Box className="order-table">
								<Box className="order-table-header">
									<Typography className="header-cell header-order">Order</Typography>
									<Typography className="header-cell header-date">Date</Typography>
									<Typography className="header-cell header-status">Status</Typography>
									<Typography className="header-cell header-total">Total</Typography>
									<Typography className="header-cell header-actions">Actions</Typography>
								</Box>
								<Box className="order-table-body">
									{orders?.length > 0 ? (
										orders.map((order: DisplayOrder, index: number) => (
											<Box key={order._id} className={`order-table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
												<Typography className="cell cell-order">
													<span className="order-number">#{order.orderNumber}</span>
												</Typography>
												<Typography className="cell cell-date">{order.date}</Typography>
												<Typography className="cell cell-status">{order.status}</Typography>
												<Typography className="cell cell-total">
													${order.total.toFixed(2)} for {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
												</Typography>
												<Box className="cell cell-actions">
													<Button className="view-button" onClick={() => viewOrderHandler(order._id)}>
														View
													</Button>
												</Box>
											</Box>
										))
									) : (
										<Box className="no-orders">
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No orders found!</p>
										</Box>
									)}
								</Box>
							</Box>
						</Box>
					)}
				</Stack>
			</div>
		);
	}
};

export default OrderTable;

