import React, { useState } from 'react';
import { Stack, Typography, TextField, Button, Divider } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CartItem } from './CartContent';

interface OrderSummaryPanelProps {
	items: CartItem[];
	shippingMethod: 'free' | 'flat';
	flatRate: number;
}

const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({ items, shippingMethod, flatRate }) => {
	const [couponCode, setCouponCode] = useState('');
	const [showCouponInput, setShowCouponInput] = useState(false);

	const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shippingCost = shippingMethod === 'free' ? 0 : flatRate;
	const total = subtotal + shippingCost;

	return (
		<Stack className="checkout-summary-panel">
			<Stack className="summary-card">
				<Typography className="summary-title">Order summary</Typography>

				{/* Product list */}
				<Stack className="product-list">
					{items.map((item) => {
						const lineTotal = item.price * item.quantity;
						return (
							<Stack key={item.id} className="product-row">
								<Stack className="product-info">
									<div className="thumbnail">
										<img src={item.image} alt={item.name} />
										<span className="quantity-badge">{item.quantity}</span>
									</div>
									<Stack className="product-text">
										<Typography className="product-name">{item.name}</Typography>
										<Typography className="product-price">${item.price.toFixed(2)}</Typography>
									</Stack>
								</Stack>
								<Typography className="line-total">${lineTotal.toFixed(2)}</Typography>
							</Stack>
						);
					})}
				</Stack>

			{/* Coupon */}
			<Stack className="coupon-section">
				<Button
					className="coupon-toggle"
					onClick={() => setShowCouponInput(!showCouponInput)}
					endIcon={<KeyboardArrowDownIcon className={showCouponInput ? 'icon-rotated' : ''} />}
				>
					Add coupons
				</Button>
				{showCouponInput && (
					<Stack className="coupon-input-row">
						<TextField
							className="coupon-input"
							label="Coupon code"
							placeholder="Coupon code"
							value={couponCode}
							onChange={(e) => setCouponCode(e.target.value)}
							variant="outlined"
							size="small"
						/>
						<Button
							className="apply-coupon-btn"
							onClick={() => console.log('Apply coupon', couponCode)}
						>
							Apply
						</Button>
					</Stack>
				)}
			</Stack>

				<Divider className="summary-divider" />

				{/* Subtotal & shipping */}
				<Stack className="totals-section">
					<Stack className="row">
						<Typography className="label">Subtotal</Typography>
						<Typography className="value">${subtotal.toFixed(2)}</Typography>
					</Stack>
					<Stack className="row">
						<Typography className="label">Shipping</Typography>
						<Typography className="value">
							{shippingMethod === 'free' ? 'FREE' : `$${shippingCost.toFixed(2)}`}
						</Typography>
					</Stack>
					<Stack className="row total-row">
						<Typography className="label">Total</Typography>
						<Typography className="value total-value">${total.toFixed(2)}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default OrderSummaryPanel;

