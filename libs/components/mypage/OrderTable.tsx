import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, Button } from '@mui/material';

interface Order {
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
	const [orders] = useState<Order[]>([
		{
			_id: '1',
			orderNumber: '13606',
			date: 'November 21, 2025',
			status: 'On hold',
			total: 532.0,
			itemCount: 2,
		},
		{
			_id: '2',
			orderNumber: '13605',
			date: 'November 21, 2025',
			status: 'On hold',
			total: 220.0,
			itemCount: 1,
		},
		{
			_id: '3',
			orderNumber: '13604',
			date: 'November 21, 2025',
			status: 'On hold',
			total: 532.0,
			itemCount: 2,
		},
		{
			_id: '4',
			orderNumber: '13603',
			date: 'November 21, 2025',
			status: 'On hold',
			total: 220.0,
			itemCount: 1,
		},
	]);

	/** HANDLERS **/
	const viewOrderHandler = () => {
		router.push('/order/detail');
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
									orders.map((order: Order, index: number) => (
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
												<Button className="view-button" onClick={viewOrderHandler}>
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
				</Stack>
			</div>
		);
	}
};

export default OrderTable;

