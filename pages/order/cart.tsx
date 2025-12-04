import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { Stack, Box, Typography, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import CartContent, { CartItem } from '../../libs/components/order/CartContent';
import CheckoutSummaryPanel from '../../libs/components/order/CheckoutSummaryPanel';
import { T } from '../../libs/types/common';
import { useCart } from '../../libs/hooks/useCart';
import { REACT_APP_API_URL } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CartPage: NextPage = (props: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { cartItems: cartItemsFromHook, updateQuantity, removeFromCart, getCartTotal } = useCart();

	const [shippingMethod, setShippingMethod] = useState<'free' | 'flat'>('free');

	const FREE_SHIPPING_THRESHOLD = 200.0;
	const FLAT_RATE = 5.0;

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
				maxStock: item.product?.productStock,
			};
		});
	}, [cartItemsFromHook]);

	// Calculate subtotal
	const subtotal = getCartTotal();

	// Handle quantity change
	const handleQuantityChange = (id: string, newQuantity: number) => {
		updateQuantity(id, newQuantity);
	};

	// Handle remove item
	const handleRemoveItem = (id: string) => {
		removeFromCart(id);
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
		router.push('/product');
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

