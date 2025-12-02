import React from 'react';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
} from '@mui/material';
import { Stack } from '@mui/material';
import { Order } from '../../../types/order/order';
import { OrderStatus, PaymentStatus } from '../../../enums/order.enum';

interface Data {
	id: string;
	user: string;
	dealer: string;
	price: string;
	paymentStatus: string;
	status: string;
	date: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: false,
		disablePadding: false,
		label: 'ORDER ID',
	},
	{
		id: 'user',
		numeric: false,
		disablePadding: false,
		label: 'USER',
	},
	{
		id: 'dealer',
		numeric: false,
		disablePadding: false,
		label: 'DEALER',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'paymentStatus',
		numeric: false,
		disablePadding: false,
		label: 'PAYMENT STATUS',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
	{
		id: 'date',
		numeric: false,
		disablePadding: false,
		label: 'DATE',
	},
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sx={{
							fontWeight: 600,
							fontSize: '13px',
							color: 'var(--carmo-text-secondary)',
							padding: '14px 20px',
						}}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface OrderPanelListType {
	orders: Order[];
}

// Helper function to format order ID (first 6 + last 4)
const formatOrderId = (id: string): string => {
	if (!id || id.length < 10) return id;
	return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
};

// Helper function to format price
const formatPrice = (price: number): string => {
	return `₩${price.toLocaleString('ko-KR')}`;
};

// Helper function to format date
const formatDate = (date: Date | string): string => {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toISOString().split('T')[0];
};

// Helper function to determine if PROCESS order is "Confirmed" or "In Delivery"
// In production, use a proper deliveryStatus field or similar logic
const isInDelivery = (order: Order): boolean => {
	// If order has shipping fee and is PROCESS, consider it "In Delivery"
	// Otherwise, it's "Confirmed"
	return order.orderStatus === OrderStatus.PROCESS && order.shippingFee !== undefined && order.shippingFee > 0;
};

// Helper function to get payment status display and color
const getPaymentStatusInfo = (paymentStatus: PaymentStatus) => {
	switch (paymentStatus) {
		case PaymentStatus.PAID:
			return { label: 'Paid', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.16)' };
		case PaymentStatus.UNPAID:
			return { label: 'Unpaid', color: '#facc15', bgColor: 'rgba(250, 204, 21, 0.16)' };
		case PaymentStatus.REFUNDED:
			return { label: 'Refunded', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.16)' };
		default:
			return { label: paymentStatus, color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
	}
};

// Helper function to get status display and color
const getStatusInfo = (order: Order) => {
	const status = order.orderStatus;
	
	switch (status) {
		case OrderStatus.PENDING:
			return { label: 'Pending', color: '#facc15', bgColor: 'rgba(250, 204, 21, 0.16)' };
		case OrderStatus.PROCESS:
			// Show "In Delivery" if shipping fee exists, otherwise "Confirmed"
			return isInDelivery(order)
				? { label: 'In Delivery', color: '#38bdf8', bgColor: 'rgba(56, 189, 248, 0.16)' }
				: { label: 'Confirmed', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.16)' };
		case OrderStatus.FINISHED:
			return { label: 'Completed', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.16)' };
		case OrderStatus.CANCELLED:
			return { label: 'Cancelled', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.16)' };
		default:
			return { label: status, color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
	}
};

export const OrderPanelList = (props: OrderPanelListType) => {
	const { orders } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{orders.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{orders.length !== 0 &&
							orders.map((order: Order) => {
								const statusInfo = getStatusInfo(order);
								const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
								const dealerName = order.orderItems?.[0]?.product?.memberData?.memberNick || '-';
								const userName = order.memberData?.memberNick || order.memberData?.memberPhone || '-';

								return (
									<TableRow 
										hover 
										key={order?._id} 
										sx={{ 
											'&:last-child td, &:last-child th': { border: 0 },
											height: '72px',
											'&:hover': {
												backgroundColor: 'var(--carmo-bg-soft)',
											}
										}}
									>
										<TableCell 
											align="left"
											sx={{ 
												padding: '20px',
												fontSize: '14px',
												color: 'var(--carmo-text)',
											}}
										>
											{formatOrderId(order._id)}
										</TableCell>
										<TableCell 
											align="left"
											sx={{ 
												padding: '20px',
												fontSize: '14px',
												color: 'var(--carmo-text)',
											}}
										>
											{userName}
										</TableCell>
										<TableCell 
											align="center"
											sx={{ 
												padding: '20px',
												fontSize: '14px',
												color: 'var(--carmo-text)',
											}}
										>
											{dealerName}
										</TableCell>
										<TableCell 
											align="center"
											sx={{ 
												padding: '20px',
												fontSize: '14px',
												color: 'var(--carmo-text)',
												fontWeight: 'bold',
											}}
										>
											{formatPrice(order.totalPrice)}
										</TableCell>
										<TableCell 
											align="center"
											sx={{ 
												padding: '20px',
												fontSize: '14px',
											}}
										>
											<Button
												className={'badge'}
												sx={{
													color: paymentStatusInfo.color,
													background: paymentStatusInfo.bgColor,
													padding: '3px 8px',
													fontWeight: 500,
													fontSize: '12px',
													borderRadius: '4px',
													textTransform: 'none',
													minWidth: 'auto',
													'&:hover': {
														background: paymentStatusInfo.bgColor,
													}
												}}
											>
												{paymentStatusInfo.label}
											</Button>
										</TableCell>
										<TableCell 
											align="center"
											sx={{ 
												padding: '20px',
												fontSize: '14px',
											}}
										>
											<Button
												className={'badge'}
												sx={{
													color: statusInfo.color,
													background: statusInfo.bgColor,
													padding: '3px 8px',
													fontWeight: 500,
													fontSize: '12px',
													borderRadius: '4px',
													textTransform: 'none',
													minWidth: 'auto',
													'&:hover': {
														background: statusInfo.bgColor,
													}
												}}
											>
												{statusInfo.label}
											</Button>
										</TableCell>
										<TableCell 
											align="center"
											sx={{ 
												padding: '20px',
												fontSize: '14px',
												color: 'var(--carmo-text)',
											}}
										>
											{formatDate(order.createdAt)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

