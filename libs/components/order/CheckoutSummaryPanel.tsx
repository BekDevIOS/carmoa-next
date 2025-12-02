import React, { useState } from 'react';
import { Stack, Typography, Button, TextField, MenuItem, Select, FormControl } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

interface CheckoutSummaryPanelProps {
	subtotal: number;
	shippingMethod: 'free' | 'flat';
	flatRate: number;
	onShippingMethodChange: (method: 'free' | 'flat') => void;
	onChangeAddress: () => void;
	onCheckout: () => void;
	shippingAddress?: string;
}

const CheckoutSummaryPanel = ({
	subtotal,
	shippingMethod,
	flatRate,
	onShippingMethodChange: _onShippingMethodChange,
	onChangeAddress,
	onCheckout,
	shippingAddress = '',
}: CheckoutSummaryPanelProps) => {
	const [showAddressForm, setShowAddressForm] = useState(false);
	const [country, setCountry] = useState('South Korea');
	const [city, setCity] = useState('');
	const [postcode, setPostcode] = useState('');

	const shippingCost = shippingMethod === 'free' ? 0 : flatRate;
	const total = subtotal + shippingCost;

	const handleChangeAddressClick = () => {
		setShowAddressForm(!showAddressForm);
		onChangeAddress();
	};

	const handleUpdateAddress = () => {
		// Handle address update logic here
		setShowAddressForm(false);
		// You can call a callback to update the parent component if needed
	};

	return (
		<Stack className="order-summary">
			<Stack className="summary-section">
				<Stack className="summary-row">
					<Typography className="summary-label">Subtotal</Typography>
					<Typography className="summary-value">${subtotal.toFixed(2)}</Typography>
				</Stack>
			</Stack>

			<Stack className="summary-section shipping-section">
				<Typography className="section-title">Shipping</Typography>
				<Typography className="shipping-method">
					{shippingMethod === 'free' ? (
						<>
							Free shipping{' '}
							<span className="shipping-method-pill shipping-method-pill--free">Included</span>
						</>
					) : (
						<>
							Flat rate:{' '}
							<span className="shipping-method-value">${flatRate.toFixed(2)}</span>
						</>
					)}
				</Typography>
				<Typography className="shipping-address">
					Shipping to <strong>{shippingAddress}</strong>.
				</Typography>
				<Button className="change-address-btn" onClick={handleChangeAddressClick} startIcon={<LocalShippingOutlinedIcon />}>
					Change address
				</Button>

				{showAddressForm && (
					<Stack className="address-form" spacing={2}>
						<Stack direction="row" alignItems="center" spacing={1} className="address-form-header">
							<Typography className="form-title">Change address</Typography>
							<LocalShippingOutlinedIcon className="form-title-icon" />
						</Stack>

						<Stack>
							<Typography className="form-label">Country / region</Typography>
							<FormControl fullWidth>
								<Select
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									className="address-select"
								>
									<MenuItem value="South Korea">South Korea</MenuItem>
									<MenuItem value="United States">United States</MenuItem>
									<MenuItem value="Japan">Japan</MenuItem>
									<MenuItem value="China">China</MenuItem>
								</Select>
							</FormControl>
						</Stack>

						<Stack>
							<Typography className="form-label">
								Town / City <span style={{ color: 'var(--carmo-primary)' }}>*</span>
							</Typography>
							<TextField
								fullWidth
								value={city}
								onChange={(e) => setCity(e.target.value)}
								className="address-input"
								required
							/>
						</Stack>

						<Stack>
							<Typography className="form-label">
								Postcode / ZIP <span style={{ color: 'var(--carmo-primary)' }}>*</span>
							</Typography>
							<TextField
								fullWidth
								value={postcode}
								onChange={(e) => setPostcode(e.target.value)}
								className="address-input"
								required
							/>
						</Stack>

						<Button className="update-address-btn" onClick={handleUpdateAddress}>
							Update
						</Button>
					</Stack>
				)}
			</Stack>

			<Stack className="summary-section total-section">
				<Stack className="summary-row total-row">
					<Typography className="summary-label">Total</Typography>
					<Typography className="summary-value total-value">${total.toFixed(2)}</Typography>
				</Stack>
			</Stack>

			<Button className="checkout-btn" onClick={onCheckout}>
				Proceed To Checkout
			</Button>
		</Stack>
	);
};

export default CheckoutSummaryPanel;

