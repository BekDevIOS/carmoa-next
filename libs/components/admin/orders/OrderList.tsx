import React, { useState } from 'react';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Collapse,
	Box,
	Menu,
	MenuItem,
	Chip,
	Divider,
	Typography,
	Tooltip,
} from '@mui/material';
import { Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Order } from '../../../types/order/order';
import { OrderItem } from '../../../types/order-item/order-item';
import { OrderStatus, PaymentStatus, OrderItemStatus } from '../../../enums/order.enum';
import { getMemberImageUrl } from '../../../config';

interface Data {
	id: string;
	user: string;
	items: string;
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
		label: 'CUSTOMER',
	},
	{
		id: 'items',
		numeric: false,
		disablePadding: false,
		label: 'ITEMS',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'TOTAL',
	},
	{
		id: 'paymentStatus',
		numeric: false,
		disablePadding: false,
		label: 'PAYMENT',
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
		label: 'ORDER DATE',
	},
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={'left'}
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
	updateOrderStatusHandler?: (orderId: string, status: OrderStatus) => void;
	updatePaymentStatusHandler?: (orderId: string, status: PaymentStatus) => void;
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

// Helper function to get item status display and color
const getItemStatusInfo = (status: OrderItemStatus) => {
	switch (status) {
		case OrderItemStatus.PENDING:
			return { label: 'Pending', color: '#facc15', bgColor: 'rgba(250, 204, 21, 0.16)' };
		case OrderItemStatus.PROCESS:
			return { label: 'Processing', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.16)' };
		case OrderItemStatus.FINISHED:
			return { label: 'Completed', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.16)' };
		case OrderItemStatus.CANCELLED:
			return { label: 'Cancelled', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.16)' };
		default:
			return { label: status, color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
	}
};

// Order Row Component with expandable items
const OrderRow = ({ 
	order, 
	updateOrderStatusHandler,
	updatePaymentStatusHandler 
}: { 
	order: Order; 
	updateOrderStatusHandler?: (orderId: string, status: OrderStatus) => void;
	updatePaymentStatusHandler?: (orderId: string, status: PaymentStatus) => void;
}) => {
	const [open, setOpen] = useState(false);
	const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
	const [paymentAnchorEl, setPaymentAnchorEl] = useState<null | HTMLElement>(null);
	const statusInfo = getStatusInfo(order);
	const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
	const userName = order.memberData?.memberNick || order.memberData?.memberPhone || '-';
	const itemCount = order.orderItems?.reduce((sum, item) => sum + item.itemQuantity, 0) || 0;
	
	const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setStatusAnchorEl(event.currentTarget);
	};
	
	const handleStatusMenuClose = () => {
		setStatusAnchorEl(null);
	};
	
	const handlePaymentMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setPaymentAnchorEl(event.currentTarget);
	};
	
	const handlePaymentMenuClose = () => {
		setPaymentAnchorEl(null);
	};
	
	const handleOrderStatusChange = (status: OrderStatus) => {
		if (updateOrderStatusHandler) {
			updateOrderStatusHandler(order._id, status);
		}
		handleStatusMenuClose();
	};
	
	const handlePaymentStatusChange = (status: PaymentStatus) => {
		if (updatePaymentStatusHandler) {
			updatePaymentStatusHandler(order._id, status);
		}
		handlePaymentMenuClose();
	};

	return (
		<React.Fragment>
			<TableRow 
				hover 
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
					<Tooltip title={order._id}>
						<span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{formatOrderId(order._id)}</span>
					</Tooltip>
				</TableCell>
				<TableCell 
					align="left"
					sx={{ 
						padding: '20px',
						fontSize: '14px',
						color: 'var(--carmo-text)',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Box component={'div'} className={'profile-img'}>
							<img
								src={getMemberImageUrl(order.memberData?.memberImage)}
								alt={'customer-photo'}
								style={{
									width: '45px',
									height: '45px',
									borderRadius: '50%',
									objectFit: 'cover',
								}}
							/>
						</Box>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
							<span style={{ fontWeight: 500 }}>{userName}</span>
							{order.memberData?.memberPhone && (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<PhoneIcon sx={{ fontSize: '14px', color: 'var(--carmo-text-secondary)' }} />
									<span style={{ fontSize: '12px', color: 'var(--carmo-text-secondary)' }}>
										{order.memberData.memberPhone}
									</span>
								</Box>
							)}
						</Box>
					</Box>
				</TableCell>
				<TableCell 
					align="left"
					sx={{ 
						padding: '20px',
						fontSize: '14px',
						color: 'var(--carmo-text)',
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.04)',
						},
						transition: 'background-color 0.2s',
					}}
					onClick={() => setOpen(!open)}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						{open ? <KeyboardArrowUpIcon sx={{ fontSize: '20px' }} /> : <KeyboardArrowDownIcon sx={{ fontSize: '20px' }} />}
						<span style={{ fontWeight: 500 }}>{itemCount} items</span>
					</Box>
				</TableCell>
				<TableCell 
					align="left"
					sx={{ 
						padding: '20px',
						fontSize: '14px',
						color: 'var(--carmo-text)',
					}}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
						<span style={{ fontWeight: 700, fontSize: '15px' }}>
							{formatPrice(order.totalPrice + (order.shippingFee || 0))}
						</span>
						{order.shippingFee && order.shippingFee > 0 && (
							<span style={{ fontSize: '11px', color: 'var(--carmo-text-secondary)' }}>
								(+{formatPrice(order.shippingFee)} shipping)
							</span>
						)}
					</Box>
				</TableCell>
				<TableCell 
					align="left"
					sx={{ 
						padding: '20px',
						fontSize: '14px',
					}}
				>
					<Tooltip title="Click to change payment status" placement="top">
						<Button
							className={'badge'}
							onClick={handlePaymentMenuOpen}
							sx={{
								color: paymentStatusInfo.color,
								background: paymentStatusInfo.bgColor,
								padding: '6px 12px',
								fontWeight: 500,
								fontSize: '12px',
								borderRadius: '6px',
								textTransform: 'none',
								minWidth: 'auto',
								cursor: 'pointer',
								transition: 'all 0.2s',
								'&:hover': {
									background: paymentStatusInfo.bgColor,
									transform: 'scale(1.05)',
									boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
								}
							}}
						>
							{paymentStatusInfo.label}
						</Button>
					</Tooltip>
					<Menu
						anchorEl={paymentAnchorEl}
						open={Boolean(paymentAnchorEl)}
						onClose={handlePaymentMenuClose}
						PaperProps={{
							sx: {
								minWidth: '140px',
								boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
							}
						}}
					>
						<MenuItem 
							onClick={() => handlePaymentStatusChange(PaymentStatus.PAID)}
							sx={{ fontSize: '13px', color: '#22c55e' }}
						>
							✓ Paid
						</MenuItem>
						<MenuItem 
							onClick={() => handlePaymentStatusChange(PaymentStatus.UNPAID)}
							sx={{ fontSize: '13px', color: '#facc15' }}
						>
							○ Unpaid
						</MenuItem>
						<MenuItem 
							onClick={() => handlePaymentStatusChange(PaymentStatus.REFUNDED)}
							sx={{ fontSize: '13px', color: '#ef4444' }}
						>
							↺ Refunded
						</MenuItem>
					</Menu>
				</TableCell>
				<TableCell 
					align="left"
					sx={{ 
						padding: '20px',
						fontSize: '14px',
					}}
				>
					<Tooltip title="Click to change order status" placement="top">
						<Button
							className={'badge'}
							onClick={handleStatusMenuOpen}
							sx={{
								color: statusInfo.color,
								background: statusInfo.bgColor,
								padding: '6px 12px',
								fontWeight: 500,
								fontSize: '12px',
								borderRadius: '6px',
								textTransform: 'none',
								minWidth: 'auto',
								cursor: 'pointer',
								transition: 'all 0.2s',
								'&:hover': {
									background: statusInfo.bgColor,
									transform: 'scale(1.05)',
									boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
								}
							}}
						>
							{statusInfo.label}
						</Button>
					</Tooltip>
					<Menu
						anchorEl={statusAnchorEl}
						open={Boolean(statusAnchorEl)}
						onClose={handleStatusMenuClose}
						PaperProps={{
							sx: {
								minWidth: '160px',
								boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
							}
						}}
					>
						<MenuItem 
							onClick={() => handleOrderStatusChange(OrderStatus.PENDING)}
							sx={{ fontSize: '13px', color: '#facc15' }}
						>
							⏳ Pending
						</MenuItem>
						<MenuItem 
							onClick={() => handleOrderStatusChange(OrderStatus.PROCESS)}
							sx={{ fontSize: '13px', color: '#fb923c' }}
						>
							⚙️ Processing
						</MenuItem>
						<MenuItem 
							onClick={() => handleOrderStatusChange(OrderStatus.FINISHED)}
							sx={{ fontSize: '13px', color: '#22c55e' }}
						>
							✓ Completed
						</MenuItem>
						<Divider />
						<MenuItem 
							onClick={() => handleOrderStatusChange(OrderStatus.CANCELLED)}
							sx={{ fontSize: '13px', color: '#ef4444' }}
						>
							✕ Cancel
						</MenuItem>
					</Menu>
				</TableCell>
				<TableCell 
					align="left"
					sx={{ 
						padding: '20px',
						fontSize: '14px',
						color: 'var(--carmo-text)',
					}}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
						<span>{formatDate(order.createdAt)}</span>
						{order.deliveredAt && (
							<Chip 
								label={`Delivered: ${formatDate(order.deliveredAt)}`}
								size="small"
								sx={{ 
									height: '18px',
									fontSize: '10px',
									backgroundColor: 'rgba(34, 197, 94, 0.1)',
									color: '#22c55e'
								}}
							/>
						)}
						{order.cancelledAt && (
							<Chip 
								label={`Cancelled: ${formatDate(order.cancelledAt)}`}
								size="small"
								sx={{ 
									height: '18px',
									fontSize: '10px',
									backgroundColor: 'rgba(239, 68, 68, 0.1)',
									color: '#ef4444'
								}}
							/>
						)}
					</Box>
				</TableCell>
			</TableRow>

			{/* Expandable Items Sub-table and Order Details */}
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 2 }}>
							{/* Customer & Shipping Information */}
							<Box sx={{ 
								mb: 2, 
								p: 2, 
								backgroundColor: 'var(--carmo-bg-soft)', 
								borderRadius: '8px',
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
								gap: 2
							}}>
								{/* Customer Info */}
								<Box>
									<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'var(--carmo-text-secondary)' }}>
										Customer Information
									</Typography>
									<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '13px' }}>
										<Box><strong>Name:</strong> {order.memberData?.memberFullName || order.memberData?.memberNick || '-'}</Box>
										<Box><strong>Email:</strong> {order.memberData?.memberEmail || '-'}</Box>
										<Box><strong>Phone:</strong> {order.memberData?.memberPhone || '-'}</Box>
										{order.paymentMethod && (
											<Box>
												<strong>Payment Method:</strong>{' '}
												<Chip 
													label={order.paymentMethod} 
													size="small" 
													sx={{ height: '20px', fontSize: '11px', ml: 1 }}
												/>
											</Box>
										)}
									</Box>
								</Box>
								
								{/* Shipping Address */}
								{order.memberData?.memberShippingAddress && (
									<Box>
										<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'var(--carmo-text-secondary)' }}>
											<LocationOnIcon sx={{ fontSize: '16px', verticalAlign: 'middle', mr: 0.5 }} />
											Shipping Address
										</Typography>
										<Box sx={{ fontSize: '13px', lineHeight: 1.6 }}>
											<Box>
												{order.memberData.memberShippingAddress.firstName}{' '}
												{order.memberData.memberShippingAddress.lastName}
											</Box>
											<Box>{order.memberData.memberShippingAddress.address1}</Box>
											{order.memberData.memberShippingAddress.address2 && (
												<Box>{order.memberData.memberShippingAddress.address2}</Box>
											)}
											<Box>
												{order.memberData.memberShippingAddress.city},{' '}
												{order.memberData.memberShippingAddress.postalCode}
											</Box>
											<Box><strong>Phone:</strong> {order.memberData.memberShippingAddress.phone}</Box>
										</Box>
									</Box>
								)}
								
								{/* Order Notes */}
								{order.notes && (
									<Box>
										<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'var(--carmo-text-secondary)' }}>
											Order Notes
										</Typography>
										<Box sx={{ 
											fontSize: '13px', 
											p: 1.5, 
											backgroundColor: 'var(--carmo-bg)', 
											borderRadius: '4px',
											fontStyle: 'italic'
										}}>
											{order.notes}
										</Box>
									</Box>
								)}
							</Box>
							
							{/* Order Items Table */}
							<Box sx={{ backgroundColor: 'var(--carmo-bg-soft)', borderRadius: '8px', padding: 2 }}>
								<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'var(--carmo-text-secondary)' }}>
									Order Items
								</Typography>
								<Table size="small">
									<TableHead>
										<TableRow>
											<TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>Product</TableCell>
											<TableCell align="center" sx={{ fontWeight: 600, fontSize: '12px' }}>Dealer</TableCell>
											<TableCell align="center" sx={{ fontWeight: 600, fontSize: '12px' }}>Qty</TableCell>
											<TableCell align="center" sx={{ fontWeight: 600, fontSize: '12px' }}>Price</TableCell>
											<TableCell align="center" sx={{ fontWeight: 600, fontSize: '12px' }}>Subtotal</TableCell>
											<TableCell align="center" sx={{ fontWeight: 600, fontSize: '12px' }}>Item Status</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{order.orderItems?.map((item: OrderItem) => {
											const itemStatusInfo = getItemStatusInfo(item.itemStatus);
											const dealerName = item.dealerData?.memberNick || item.dealerData?.memberPhone || '-';
											const productTitle = item.productData?.productTitle || 'Unknown Product';
											const subtotal = item.itemPrice * item.itemQuantity;
											
											return (
												<TableRow key={item._id}>
													<TableCell sx={{ fontSize: '13px' }}>
														<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
															<span style={{ fontWeight: 500 }}>{productTitle}</span>
															{item.productData?.productOemNumbers && item.productData.productOemNumbers.length > 0 && (
																<span style={{ fontSize: '11px', color: 'var(--carmo-text-secondary)' }}>
																	OEM: {item.productData.productOemNumbers.join(', ')}
																</span>
															)}
														</Box>
													</TableCell>
													<TableCell align="center" sx={{ fontSize: '13px' }}>{dealerName}</TableCell>
													<TableCell align="center" sx={{ fontSize: '13px', fontWeight: 500 }}>
														×{item.itemQuantity}
													</TableCell>
													<TableCell align="center" sx={{ fontSize: '13px' }}>
														{formatPrice(item.itemPrice)}
													</TableCell>
													<TableCell align="center" sx={{ fontSize: '13px', fontWeight: 600 }}>
														{formatPrice(subtotal)}
													</TableCell>
													<TableCell align="center">
														<Button
															className={'badge'}
															sx={{
																color: itemStatusInfo.color,
																background: itemStatusInfo.bgColor,
																padding: '2px 6px',
																fontWeight: 500,
																fontSize: '11px',
																borderRadius: '4px',
																textTransform: 'none',
																minWidth: 'auto',
																'&:hover': {
																	background: itemStatusInfo.bgColor,
																}
															}}
														>
															{itemStatusInfo.label}
														</Button>
													</TableCell>
												</TableRow>
											);
										})}
										{/* Order Summary */}
										<TableRow>
											<TableCell colSpan={4} align="right" sx={{ fontWeight: 600, fontSize: '13px', pt: 2 }}>
												Shipping Fee:
											</TableCell>
											<TableCell align="center" sx={{ fontWeight: 600, fontSize: '13px', pt: 2 }}>
												{formatPrice(order.shippingFee || 0)}
											</TableCell>
											<TableCell />
										</TableRow>
										<TableRow>
											<TableCell colSpan={4} align="right" sx={{ fontWeight: 700, fontSize: '14px' }}>
												Total:
											</TableCell>
											<TableCell align="center" sx={{ fontWeight: 700, fontSize: '14px', color: 'var(--carmo-primary)' }}>
												{formatPrice(order.totalPrice)}
											</TableCell>
											<TableCell />
										</TableRow>
									</TableBody>
								</Table>
							</Box>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
};

export const OrderPanelList = (props: OrderPanelListType) => {
	const { orders, updateOrderStatusHandler, updatePaymentStatusHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{orders.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<Box sx={{ py: 4 }}>
										<Typography variant="body1" sx={{ color: 'var(--carmo-text-secondary)' }}>
											No orders found
										</Typography>
									</Box>
								</TableCell>
							</TableRow>
						)}

						{orders.length !== 0 && orders.map((order: Order) => (
							<OrderRow 
								key={order._id} 
								order={order} 
								updateOrderStatusHandler={updateOrderStatusHandler}
								updatePaymentStatusHandler={updatePaymentStatusHandler}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

