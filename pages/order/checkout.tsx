import React, { useState, useMemo, useCallback } from 'react';
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
import { useCart } from '../../libs/hooks/useCart';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '../../apollo/user/mutation';
import { OrderInput, OrderItemInput } from '../../libs/types/order/order.input';
import { PaymentMethod } from '../../libs/enums/order.enum';
import { MemberShippingAddress, MemberBillingAddress } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinSuccessAlert, sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';

const CheckoutPage: NextPage<T> = (props: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { cartItems: cartItemsFromHook, getCartTotal, clearCart } = useCart();
	const [createOrder] = useMutation(CREATE_ORDER);

	// Address state
	const [shippingAddress, setShippingAddress] = useState<MemberShippingAddress | undefined>(
		user.memberShippingAddress
	);
	const [billingAddress, setBillingAddress] = useState<MemberBillingAddress | undefined>(
		user.memberBillingAddress
	);
	const [useSameForBilling, setUseSameForBilling] = useState(true);

	const [email, setEmail] = useState(user.memberEmail || '');
	const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('bank');
	const [orderNote, setOrderNote] = useState('');
	const [noteEnabled, setNoteEnabled] = useState(false);

	const FREE_SHIPPING_THRESHOLD = 300.0;
	const FLAT_RATE = 20.0;

	// Map cart items from useCart to CartContent format
	const cartItems: CartItem[] = useMemo(() => {
		return cartItemsFromHook.map((item) => {
			const productImage = item.product?.productImages?.[0]
				? item.product.productImages[0].startsWith('http') || item.product.productImages[0].startsWith('/img')
					? item.product.productImages[0]
					: `${REACT_APP_API_URL}/${item.product.productImages[0]}`
				: '/img/banner/header1.svg';

			return {
				id: item._id,
				name: item.product?.productTitle || 'Product',
				price: item.price,
				quantity: item.quantity,
				image: productImage,
			};
		});
	}, [cartItemsFromHook]);

	const subtotal = getCartTotal();
	// Calculate shipping fee based on subtotal
	const calculatedShippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE;
	// Update shipping method based on calculated fee
	const effectiveShippingMethod = calculatedShippingFee === 0 ? 'free' : 'flat';

	// Handle address changes
	const handleShippingChange = useCallback((data: MemberShippingAddress) => {
		setShippingAddress(data);
		if (useSameForBilling) {
			// Auto-update billing if "use same" is checked
			setBillingAddress({
				country: 'South Korea',
				firstName: data.firstName,
				lastName: data.lastName,
				address1: data.address1,
				address2: data.address2,
				city: data.city,
				postalCode: data.postalCode,
				phone: data.phone,
			});
		}
	}, [useSameForBilling]);

	const handleBillingChange = useCallback((data: MemberBillingAddress) => {
		setBillingAddress(data);
	}, []);

	const handleToggleUseForBilling = useCallback((useSame: boolean) => {
		setUseSameForBilling(useSame);
		if (useSame && shippingAddress) {
			// Copy shipping to billing
			setBillingAddress({
				country: 'South Korea',
				firstName: shippingAddress.firstName,
				lastName: shippingAddress.lastName,
				address1: shippingAddress.address1,
				address2: shippingAddress.address2,
				city: shippingAddress.city,
				postalCode: shippingAddress.postalCode,
				phone: shippingAddress.phone,
			});
		}
	}, [shippingAddress]);

	// Handle place order
	const handlePlaceOrder = useCallback(async () => {
		try {
			// Validate cart
			if (cartItemsFromHook.length === 0) {
				await sweetMixinErrorAlert('Your cart is empty');
				return;
			}

			// Validate shipping address (required)
			if (!shippingAddress?.firstName || !shippingAddress?.phone || !shippingAddress?.address1 || !shippingAddress?.postalCode) {
				await sweetMixinErrorAlert('Please fill in all required shipping address fields: First Name, Phone, Address, and Postal Code.');
				return;
			}

			// Validate billing address (only if user has entered any billing data)
			const hasBillingData = billingAddress && (
				billingAddress.country ||
				billingAddress.firstName ||
				billingAddress.address1 ||
				billingAddress.postalCode ||
				billingAddress.lastName ||
				billingAddress.address2 ||
				billingAddress.city ||
				billingAddress.phone
			);

			if (hasBillingData) {
				if (!billingAddress?.country || !billingAddress?.firstName || !billingAddress?.address1 || !billingAddress?.postalCode) {
					await sweetMixinErrorAlert('Please fill in all required billing address fields: Country, First Name, Address, and Postal Code.');
					return;
				}
			}

			// Validate email
			if (!email || !email.includes('@')) {
				await sweetMixinErrorAlert('Please enter a valid email address');
				return;
			}

			// Get dealer ID from first product (assuming all products have same dealer)
			const dealerId = cartItemsFromHook[0]?.product?.dealerId;
			if (!dealerId) {
				await sweetMixinErrorAlert('Unable to determine product dealer');
				return;
			}

			// Build order items
			const orderItems: OrderItemInput[] = cartItemsFromHook.map((item) => ({
				productId: item.product._id,
				itemQuantity: item.quantity,
				itemPrice: item.price,
			}));

			// Map payment method
			const paymentMethodEnum = paymentMethod === 'bank' ? PaymentMethod.TRANSFER : PaymentMethod.CASH;

			// Build order input
			const orderInput: OrderInput = {
				orderItems,
				dealerId,
				paymentMethod: paymentMethodEnum,
				paymentStatus: paymentMethod === 'bank' ? undefined : undefined, // Let backend decide
				notes: noteEnabled && orderNote ? orderNote : undefined,
			};

			// Create order
			const result = await createOrder({
				variables: { input: orderInput },
			});

			const orderId = result?.data?.createOrder?._id;
			if (orderId) {
				// Clear cart
				clearCart();
				// Navigate to order detail
				await sweetMixinSuccessAlert('Order placed successfully!');
				router.push(`/order/detail?orderId=${orderId}`);
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [cartItemsFromHook, shippingAddress, billingAddress, email, paymentMethod, orderNote, noteEnabled, createOrder, clearCart, router]);

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
						<AddressTable
							title="Shipping address"
							type="shipping"
							shippingData={shippingAddress}
							onShippingChange={handleShippingChange}
							showUseForBillingCheckbox
							onToggleUseForBillingSame={handleToggleUseForBilling}
						/>

						{/* Billing address */}
						<AddressTable
							title="Billing address"
							type="billing"
							billingData={billingAddress}
							onBillingChange={handleBillingChange}
						/>

						{/* Shipping options */}
						<Stack className="shipping-options-card">
							<Typography className="section-title">Shipping options</Typography>
							<Stack className="shipping-info">
								<Typography className="shipping-method-text">
									{calculatedShippingFee === 0 ? (
										<>
											Free shipping{' '}
											<span className="shipping-method-pill shipping-method-pill--free">Included</span>
										</>
									) : (
										<>
											Flat rate: <span className="shipping-method-value">${FLAT_RATE.toFixed(2)}</span>
										</>
									)}
								</Typography>
								{subtotal < FREE_SHIPPING_THRESHOLD && (
									<Typography className="shipping-threshold-text">
										Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
									</Typography>
								)}
							</Stack>
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
									onClick={handlePlaceOrder}
								>
									Place Order
								</Button>
							</Stack>
						</Stack>
					</Stack>

					{/* Right column: order summary */}
					<OrderSummaryPanel items={cartItems} shippingMethod={effectiveShippingMethod} flatRate={FLAT_RATE} />
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(CheckoutPage);
