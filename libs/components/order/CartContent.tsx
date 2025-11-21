import React from 'react';
import { Stack, Typography, TextField, Button, IconButton, Box } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

interface CartContentProps {
	items: CartItem[];
	subtotal: number;
	threshold: number;
	onQuantityChange: (id: string, newQuantity: number) => void;
	onRemove: (id: string) => void;
	onApplyCoupon: (code: string) => void;
}

const CartContent = ({
	items,
	subtotal,
	threshold,
	onQuantityChange,
	onRemove,
	onApplyCoupon,
}: CartContentProps) => {
	const [couponCode, setCouponCode] = React.useState('');
	const progress = Math.min((subtotal / threshold) * 100, 100);
	const hasFreeShipping = subtotal >= threshold;

	const handleApplyCoupon = () => {
		if (couponCode.trim()) {
			onApplyCoupon(couponCode.trim());
		}
	};

	const handleIncrement = (id: string, currentQuantity: number) => {
		onQuantityChange(id, currentQuantity + 1);
	};

	const handleDecrement = (id: string, currentQuantity: number) => {
		if (currentQuantity > 1) {
			onQuantityChange(id, currentQuantity - 1);
		}
	};

	const remaining = Math.max(threshold - subtotal, 0);

	return (
		<Stack className="cart-content">
			{/* Shipping Progress Bar */}
			<Stack className="shipping-progress-container">
				<Stack className="progress-header">
					<LocalShippingOutlinedIcon className="shipping-icon" />
					<Stack className="progress-copy">
						<Typography className="progress-title">
							FREE SHIPPING ON ORDER <span className="threshold-amount">${threshold.toFixed(2)}</span>
						</Typography>
						{hasFreeShipping ? (
							<Typography className="progress-subtitle">Congratulations, you have got free shipping!</Typography>
						) : (
							<Typography className="progress-subtitle">
								Spend <span className="remaining-amount">${remaining.toFixed(2)}</span> more and get{' '}
								<strong>Free Shipping!</strong>
							</Typography>
						)}
					</Stack>
				</Stack>

				<Box className="progress-bar-container">
					<Box className="progress-bar" style={{ width: `${progress}%` }} />
					<Box className="progress-icon-wrapper" style={{ left: `${progress}%` }}>
						<LocalShippingOutlinedIcon className="progress-truck-icon" />
					</Box>
				</Box>
			</Stack>

			{/* Cart Table */}
			<Stack className="cart-table">
				<Stack className="cart-table-header">
					<Typography className="header-product">Product</Typography>
					<Typography className="header-quantity">Quantity</Typography>
					<Typography className="header-subtotal">Subtotal</Typography>
				</Stack>

				<Stack className="cart-table-body">
					{items.map((item) => {
						const itemSubtotal = item.price * item.quantity;
						return (
							<Stack key={item.id} className="cart-item-row">
								<Stack className="product-info">
									<Box className="product-image">
										<img src={item.image} alt={item.name} />
									</Box>
									<Stack className="product-details">
										<Typography className="product-name">{item.name}</Typography>
										<Typography className="product-price">${item.price.toFixed(2)}</Typography>
									</Stack>
								</Stack>

								<Stack className="quantity-controls">
									<IconButton
										className="quantity-btn minus"
										onClick={() => handleDecrement(item.id, item.quantity)}
									>
										<RemoveIcon />
									</IconButton>
									<Typography className="quantity-value">{item.quantity}</Typography>
									<IconButton
										className="quantity-btn plus"
										onClick={() => handleIncrement(item.id, item.quantity)}
									>
										<AddIcon />
									</IconButton>
								</Stack>

								<Stack className="item-subtotal">
									<Typography className="subtotal-amount">${itemSubtotal.toFixed(2)}</Typography>
									<IconButton className="remove-btn" onClick={() => onRemove(item.id)}>
										<DeleteOutlineIcon />
									</IconButton>
								</Stack>
							</Stack>
						);
					})}
				</Stack>
				<Stack className="coupon-row">
					<TextField
						className="coupon-input"
						placeholder="Coupon code"
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value)}
						variant="outlined"
					/>
					<Button className="apply-coupon-btn" onClick={handleApplyCoupon}>
						Apply Coupon
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default CartContent;

