import React, { useState } from 'react';
import { NextPage } from 'next';
import { Stack, Box, Typography, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import CartContent, { CartItem } from '../../libs/components/order/CartContent';
import CheckoutSummaryPanel from '../../libs/components/order/CheckoutSummaryPanel';
import { T } from '../../libs/types/common';

const CartPage: NextPage = (props: T) => {
	const device = useDeviceDetect();
	const router = useRouter();

	// Mock cart data - replace with actual cart state management later
	const [cartItems, setCartItems] = useState<CartItem[]>([
		{
			id: '1',
			name: 'Circular Saw with Overload Protection Lawazim 1400W',
			price: 255.0,
			quantity: 1,
			image: '/img/product/image1.png', // Using public/img/product images
		},
		
	]);

	const [shippingMethod, setShippingMethod] = useState<'free' | 'flat'>('free');

	const FREE_SHIPPING_THRESHOLD = 300.0;
	const FLAT_RATE = 20.0;

	// Calculate subtotal
	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	// Handle quantity change
	const handleQuantityChange = (id: string, newQuantity: number) => {
		setCartItems((prevItems) =>
			prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)),
		);
	};

	// Handle remove item
	const handleRemoveItem = (id: string) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
	};

	// Handle apply coupon
	const handleApplyCoupon = (code: string) => {
		console.log('Applying coupon:', code);
		// TODO: Implement coupon validation and discount logic
	};

	// Handle shipping method change
	const handleShippingMethodChange = (method: 'free' | 'flat') => {
		setShippingMethod(method);
	};

	// Handle change address
	const handleChangeAddress = () => {
		console.log('Change address clicked');
		// TODO: Implement address change functionality
	};

	// Handle checkout
	const handleCheckout = () => {
		router.push('/order/checkout');
	};

	// Handle return to shop
	const handleReturnToShop = () => {
		router.push('/products');
	};

	if (device === 'mobile') {
		return <div>CART PAGE MOBILE</div>;
	} else {
		return (
			<div id="cart-page">
				<div className="container">
					{cartItems.length === 0 ? (
						<Stack className="empty-cart-container">
							<Box className="empty-cart-message">
								<Box className="info-icon-wrapper">
									<InfoOutlinedIcon className="info-icon" />
								</Box>
								<Typography className="empty-cart-text">Your cart is currently empty.</Typography>
							</Box>
							<Button className="return-to-shop-btn" onClick={handleReturnToShop}>
								Return to shop
							</Button>
						</Stack>
					) : (
						<Stack className="cart-layout">
						<CartContent
							items={cartItems}
							subtotal={subtotal}
							threshold={FREE_SHIPPING_THRESHOLD}
							onQuantityChange={handleQuantityChange}
							onRemove={handleRemoveItem}
							onApplyCoupon={handleApplyCoupon}
						/>
						<CheckoutSummaryPanel
							subtotal={subtotal}
							shippingMethod={shippingMethod}
							flatRate={FLAT_RATE}
							onShippingMethodChange={handleShippingMethodChange}
							onChangeAddress={handleChangeAddress}
							onCheckout={handleCheckout}
						/>
						</Stack>
					)}
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(CartPage);

