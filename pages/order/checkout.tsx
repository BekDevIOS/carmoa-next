import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Stack,
	Box,
	Typography,
	TextField,
	RadioGroup,
	FormControlLabel,
	Radio,
	Button,
	Checkbox,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { T } from '../../libs/types/common';
import { CartItem } from '../../libs/components/order/CartContent';
import AddressTable from '../../libs/components/order/AddressTable';
import OrderSummaryPanel from '../../libs/components/order/OrderSummaryPanel';

const CheckoutPage: NextPage<T> = (props: T) => {
	const device = useDeviceDetect();
	const router = useRouter();

	// Mock cart data - same pattern as cart page
	const [cartItems] = useState<CartItem[]>([
		{
			id: '1',
			name: 'Black Decker 20V Li Ion Compact Cordless Electric Hand Drill',
			price: 266.0,
			quantity: 2,
			image: '/img/product/image1.png',
		},
	]);

	const [email, setEmail] = useState('umekhmonboev@gmail.com');
	const [shippingMethod, setShippingMethod] = useState<'free' | 'flat'>('free');
	const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('bank');
	const [orderNote, setOrderNote] = useState('');
	const [noteEnabled, setNoteEnabled] = useState(false);

	const FREE_SHIPPING_THRESHOLD = 300.0;
	const FLAT_RATE = 20.0;

	if (device === 'mobile') {
		return <div>CHECKOUT PAGE MOBILE</div>;
	}

	return (
		<div id="checkout-page">
			<div className="container">
				<Stack className="checkout-layout">
					{/* Left column: contact + addresses */}
					<Stack className="checkout-main">
						{/* Contact information */}
						<Stack className="contact-card">
							<Typography className="section-heading">Contact information</Typography>
							<Typography className="section-subtitle">
								We&apos;ll use this email to send you details and updates about your order.
							</Typography>
							<Stack className="field-group">
								<TextField
									fullWidth
									label="Email address"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="field-input"
									required
									type="email"
								/>
							</Stack>
						</Stack>

						{/* Shipping address */}
						<AddressTable title="Shipping address" showUseForBillingCheckbox />

						{/* Billing address */}

						<AddressTable title="Billing address" />

						{/* Shipping options */}
						<Stack className="shipping-options-card">
							<Typography className="section-title">Shipping options</Typography>
							<RadioGroup value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value as 'free' | 'flat')}>
								<FormControlLabel
									value="free"
									control={<Radio />}
									label={
										<Stack className="option-row">
											<Typography className="option-label">Free shipping</Typography>
											<Typography className="option-price">FREE</Typography>
										</Stack>
									}
									className="option-control"
								/>
								<FormControlLabel
									value="flat"
									control={<Radio />}
									label={
										<Stack className="option-row">
											<Typography className="option-label">Flat rate</Typography>
											<Typography className="option-price">${FLAT_RATE.toFixed(2)}</Typography>
										</Stack>
									}
									className="option-control"
								/>
							</RadioGroup>
						</Stack>

						{/* Payment options */}
						<Stack className="payment-card">
							<Typography className="section-title">Payment options</Typography>
							<RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'bank' | 'cod')}>
								<FormControlLabel
									value="bank"
									control={<Radio />}
									label={
										<Stack className="payment-option">
											<Typography className="option-label">Direct bank transfer</Typography>
											<Typography className="option-description">
												Make your payment directly into our bank account. Please use your Order ID as the payment
												reference. Your order will not be shipped until the funds have cleared in our account.
											</Typography>
										</Stack>
									}
									className="option-control"
								/>
								<FormControlLabel
									value="cod"
									control={<Radio />}
									label={
										<Stack className="payment-option">
											<Typography className="option-label">Cash on delivery</Typography>
										</Stack>
									}
									className="option-control"
								/>
							</RadioGroup>

							{/* Order note */}
							<Stack className="note-section">
								<FormControlLabel
									control={
										<Checkbox
											checked={noteEnabled}
											onChange={(e) => setNoteEnabled(e.target.checked)}
											sx={{
												color: '#000',
												'&.Mui-checked': {
													color: '#000',
												},
											}}
										/>
									}
									label="Add a note to your order"
									className="note-label"
								/>

								{noteEnabled && (
									<TextField
										minRows={3}
										label="Order note"
										placeholder="Special instructions for delivery or order handling"
										value={orderNote}
										onChange={(e) => setOrderNote(e.target.value)}
										className="note-input"
										fullWidth
									/>
								)}
							</Stack>

							<Typography className="terms-text">
								By proceeding with your purchase you agree to our <span className="link">Terms and Conditions</span> and{' '}
								<span className="link">Privacy Policy</span>.
							</Typography>

							<Stack className="checkout-actions" direction="row" justifyContent="space-between" alignItems="center">
								<Button
									className="return-to-cart-btn"
									onClick={() => router.push('/order/cart')}
									startIcon={<ArrowBackIosNewIcon />}
								>
									Return to Cart
								</Button>
								<Button
									className="place-order-btn"
									onClick={() => {
										console.log('Place order from checkout page', {
											email,
											shippingMethod,
											paymentMethod,
											orderNote,
										});
									}}
								>
									Place Order
								</Button>
							</Stack>
						</Stack>
					</Stack>

					{/* Right column: order summary */}
					<OrderSummaryPanel items={cartItems} shippingMethod={shippingMethod} flatRate={FLAT_RATE} />
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(CheckoutPage);
