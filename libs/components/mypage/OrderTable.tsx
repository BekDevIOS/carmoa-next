import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import {
	Stack,
	Box,
	Typography,
	Button,
	CircularProgress,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from '@mui/material';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_MY_ORDERS, GET_ORDERS_BY_DEALER } from '../../../apollo/user/query';
import { UPDATE_ORDER_ITEM_BY_DEALER } from '../../../apollo/user/mutation';
import { OrdersInquiry } from '../../types/order/order.input';
import { DealerOrderItemUpdate } from '../../types/order-item/order-item.update';
import { Order as OrderType } from '../../types/order/order';
import { OrderItem } from '../../types/order-item/order-item';
import { OrderStatus, OrderItemStatus } from '../../enums/order.enum';
import { Direction } from '../../enums/common.enum';
import { MemberType } from '../../enums/member.enum';
import { userVar } from '../../../apollo/store';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert, sweetConfirmAlert } from '../../sweetAlert';

interface DisplayOrder {
	_id: string;
	orderNumber: string;
	date: string;
	status: string;
	originalStatus: OrderStatus | OrderItemStatus;
	total: number;
	itemCount: number;
	orderItems?: OrderItem[];
}

const OrderTable: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const isDealer = user?.memberType === MemberType.DEALER;
	const [searchOrders, setSearchOrders] = useState<OrdersInquiry>({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	});
	const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

	/** APOLLO REQUESTS **/
	const {
		loading: ordersLoading,
		data: ordersData,
		error: ordersError,
		refetch: ordersRefetch,
	} = useQuery(isDealer ? GET_ORDERS_BY_DEALER : GET_MY_ORDERS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchOrders,
		},
		notifyOnNetworkStatusChange: true,
	});

	const [updateOrderItemByDealer] = useMutation(UPDATE_ORDER_ITEM_BY_DEALER);

	// Map backend orders to display format
	const orders: DisplayOrder[] = useMemo(() => {
		const ordersList = isDealer 
			? ordersData?.getOrdersByDealer?.list 
			: ordersData?.getMyOrders?.list;

		if (!ordersList) return [];

		// Deduplicate orders by _id (in case backend returns duplicates)
		const uniqueOrdersMap = new Map<string, OrderType>();
		ordersList.forEach((order: OrderType) => {
			if (!uniqueOrdersMap.has(order._id)) {
				uniqueOrdersMap.set(order._id, order);
			}
		});

		const uniqueOrders = Array.from(uniqueOrdersMap.values());

		return uniqueOrders.map((order: OrderType) => {
			// Format order status
			const formatStatus = (status: OrderStatus | OrderItemStatus): string => {
				switch (status) {
					case OrderStatus.PENDING:
					case OrderItemStatus.PENDING:
						return 'Pending';
					case OrderStatus.PROCESS:
					case OrderItemStatus.PROCESS:
						return 'Processing';
					case OrderStatus.FINISHED:
					case OrderItemStatus.FINISHED:
						return 'Completed';
					case OrderStatus.CANCELLED:
					case OrderItemStatus.CANCELLED:
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

			// Filter order items for this dealer if dealer
			const relevantItems = isDealer 
				? order.orderItems?.filter(item => item.dealerId === user?._id) || []
				: order.orderItems || [];

			// Calculate item count from relevant items
			const itemCount = relevantItems.reduce((sum, item) => sum + item.itemQuantity, 0);

			// Calculate total for relevant items (dealers see only their items' total)
			const dealerTotal = relevantItems.reduce((sum, item) => sum + (item.itemPrice * item.itemQuantity), 0);

			// Use last 6 characters of _id as order number
			const orderNumber = order._id.slice(-6).toUpperCase();

			// For dealers, determine the most common status among their items
			let displayStatus: OrderStatus | OrderItemStatus;
			if (isDealer && relevantItems.length > 0) {
				// Use the first item's status as representative (or you could implement more complex logic)
				displayStatus = relevantItems[0].itemStatus;
			} else {
				displayStatus = order.orderStatus;
			}

			return {
				_id: order._id,
				orderNumber,
				date: formatDate(order.createdAt),
				status: formatStatus(displayStatus),
				originalStatus: displayStatus,
				total: isDealer ? dealerTotal : (order.totalPrice || 0),
				itemCount,
				orderItems: relevantItems,
			};
		});
	}, [ordersData, isDealer, user]);

	/** HANDLERS **/
	const viewOrderHandler = (orderId: string) => {
		router.push(`/order/detail?orderId=${orderId}`);
	};

	const handleStatusFilterChange = (event: any) => {
		const value = event.target.value;
		setStatusFilter(value);
		setSearchOrders({
			...searchOrders,
			search: {
				orderStatus: value === 'ALL' ? undefined : (value as OrderStatus),
			},
		});
	};

	const handleStatusChange = async (order: DisplayOrder, newStatus: OrderItemStatus) => {
		try {
			// Format status name for confirmation message
			const formatStatusName = (status: OrderItemStatus): string => {
				switch (status) {
					case OrderItemStatus.PENDING:
						return 'Pending';
					case OrderItemStatus.PROCESS:
						return 'Processing';
					case OrderItemStatus.FINISHED:
						return 'Completed';
					case OrderItemStatus.CANCELLED:
						return 'Cancelled';
					default:
						return status;
				}
			};

			const statusName = formatStatusName(newStatus);
			const itemText = order.orderItems && order.orderItems.length > 1 
				? `all ${order.orderItems.length} items` 
				: 'this item';
			
			const confirmed = await sweetConfirmAlert(
				`Are you sure you want to change the status of ${itemText} in order #${order.orderNumber} to ${statusName}?`
			);

			if (!confirmed) {
				return; // User cancelled, don't proceed
			}

			// Update all order items for this dealer in this order
			if (order.orderItems && order.orderItems.length > 0) {
				// Update all items sequentially
				for (const item of order.orderItems) {
					const updateInput: DealerOrderItemUpdate = {
						orderItemId: item._id,
						itemStatus: newStatus,
					};

					await updateOrderItemByDealer({
						variables: { input: updateInput },
					});
				}

				await ordersRefetch();
				await sweetTopSmallSuccessAlert('Order status updated successfully!', 800);
			}
		} catch (err: any) {
			console.log('ERROR, handleStatusChange:', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>ORDER TABLE MOBILE</div>;
	} else {
		return (
			<div id="order-table-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Orders</Typography>
						<Typography className="sub-title">
							{isDealer ? 'Orders for your products' : 'Here are your recent orders'}
						</Typography>
					</Stack>
					{isDealer && (
						<FormControl className="status-filter" size="small" sx={{ minWidth: 180 }}>
							<InputLabel>Filter by Status</InputLabel>
							<Select value={statusFilter} label="Filter by Status" onChange={handleStatusFilterChange}>
								<MenuItem value="ALL">All Orders</MenuItem>
								<MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
								<MenuItem value={OrderStatus.PROCESS}>Processing</MenuItem>
								<MenuItem value={OrderStatus.FINISHED}>Completed</MenuItem>
								<MenuItem value={OrderStatus.CANCELLED}>Cancelled</MenuItem>
							</Select>
						</FormControl>
					)}
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
												<Box className="cell cell-status">
													{isDealer ? (
														<FormControl size="small" sx={{ minWidth: 140 }}>
															<Select
																value={order.originalStatus}
																onChange={(e) => handleStatusChange(order, e.target.value as OrderItemStatus)}
																sx={{
																	fontSize: '14px',
																	'& .MuiOutlinedInput-notchedOutline': {
																		borderColor: 'var(--carmo-border)',
																	},
																	'&:hover .MuiOutlinedInput-notchedOutline': {
																		borderColor: 'var(--carmo-primary)',
																	},
																	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
																		borderColor: 'var(--carmo-primary)',
																	},
																}}
															>
																<MenuItem value={OrderItemStatus.PENDING}>Pending</MenuItem>
																<MenuItem value={OrderItemStatus.PROCESS}>Processing</MenuItem>
																<MenuItem value={OrderItemStatus.FINISHED}>Completed</MenuItem>
																<MenuItem value={OrderItemStatus.CANCELLED}>Cancelled</MenuItem>
															</Select>
														</FormControl>
													) : (
														<Typography>{order.status}</Typography>
													)}
												</Box>
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
