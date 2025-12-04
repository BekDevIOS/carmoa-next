import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, CircularProgress } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { T } from '../../libs/types/common';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_ORDER } from '../../apollo/user/query';
import { Order } from '../../libs/types/order/order';
import { PaymentMethod } from '../../libs/enums/order.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { userVar } from '../../apollo/store';

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const OrderDetailPage: NextPage = (props: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { orderId } = router.query;
	const user = useReactiveVar(userVar);
	const isDealer = user?.memberType === MemberType.DEALER;

	const { data, loading, error } = useQuery(GET_ORDER, {
		variables: { orderId: orderId as string },
		skip: !orderId,
		fetchPolicy: 'network-only',
	});


	const order: Order | undefined = data?.getOrder;

	const displayOrderItems = useMemo(() => {
		if (!order || !order.orderItems) return [];

		if (isDealer && user?._id) {
			return order.orderItems.filter((item) => item.dealerId === user._id);
		}

		return order.orderItems;
	}, [order?.orderItems, isDealer, user?._id]);

	const subtotal = displayOrderItems.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0);

	const shippingFee = isDealer ? 0 : order?.shippingFee || 0;

	const total = subtotal + shippingFee;

	const shippingAddress = order?.memberData?.memberShippingAddress;
	const billingAddress = order?.memberData?.memberBillingAddress;
	const email = order?.memberData?.memberEmail || '-';

	const formatDate = (dateString: string | Date | undefined) => {
		if (!dateString) return 'N/A';
		const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	};

	const formatPaymentMethod = (method: PaymentMethod | undefined) => {
		if (!method) return 'N/A';
		switch (method) {
			case PaymentMethod.TRANSFER:
				return 'Direct bank transfer';
			case PaymentMethod.CASH:
				return 'Cash on delivery';
			case PaymentMethod.CARD:
				return 'Credit card';
			case PaymentMethod.KAKAOPAY:
				return 'Kakao Pay';
			default:
				return method;
		}
	};

	// Format address
	const formatAddress = (address: any, isBilling: boolean = false) => {
		if (!address) return [];
		const lines: string[] = [];
		if (address.firstName || address.lastName) {
			lines.push(`${address.firstName || ''} ${address.lastName || ''}`.trim());
		}
		if (address.address1) lines.push(address.address1);
		if (address.address2) lines.push(address.address2);
		if (address.city) lines.push(address.city);
		if (address.postalCode) lines.push(address.postalCode);
		if (isBilling && address.country) lines.push(address.country);
		return lines;
	};

	if (loading) {
		return (
			<div id="order-detail-page">
				<div className="container">
					<Stack alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
						<CircularProgress />
					</Stack>
				</div>
			</div>
		);
	}

	if (error || !order) {
		return (
			<div id="order-detail-page">
				<div className="container">
					<Stack alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
						<Typography>Error loading order. Please try again.</Typography>
					</Stack>
				</div>
			</div>
		);
	}

	if (device === 'mobile') {
		return <div>ORDER DETAIL PAGE MOBILE</div>;
	}

	return (
		<div id="order-detail-page">
			<div className="container">
				<Stack className="order-confirmation">
					<Typography className="order-confirmation-title">Order Overview</Typography>
					<Stack className="order-meta">
						<Stack className="order-meta-item">
							<Typography className="label">Order number:</Typography>
							<Typography className="value">{order._id}</Typography>
						</Stack>
						<Stack className="order-meta-item">
							<Typography className="label">Date:</Typography>
							<Typography className="value">{formatDate(order.createdAt)}</Typography>
						</Stack>
						<Stack className="order-meta-item">
							<Typography className="label">Email:</Typography>
							<Typography className="value">{email}</Typography>
						</Stack>
						<Stack className="order-meta-item">
							<Typography className="label">Total:</Typography>
							<Typography className="value">${total.toFixed(2)}</Typography>
						</Stack>
						<Stack className="order-meta-item">
							<Typography className="label">Payment method:</Typography>
							<Typography className="value">{formatPaymentMethod(order.paymentMethod)}</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Stack className="order-content">
					<Typography className="section-title">Order details</Typography>
					<Box className="order-details-card">
						<Box className="order-table">
							<Box className="order-table-header">
								<Typography className="header-product">Product</Typography>
								<Typography className="header-total">Total</Typography>
							</Box>
							<Box className="order-table-body">
								{displayOrderItems.map((item) => {
									const itemTotal = item.itemPrice * item.itemQuantity;
									return (
										<Box key={item._id} className="order-table-row product-row">
											<Typography className="product-name">
												{item.productData?.productTitle || 'Product'} × {item.itemQuantity}
											</Typography>
											<Typography className="product-total">${itemTotal.toFixed(2)}</Typography>
										</Box>
									);
								})}
								<Box className="order-table-row">
									<Typography className="label">Subtotal:</Typography>
									<Typography className="value">${subtotal.toFixed(2)}</Typography>
								</Box>
								<Box className="order-table-row">
									<Typography className="label">Shipping:</Typography>
									<Typography className="value">
										{shippingFee === 0 ? 'Free shipping' : `$${shippingFee.toFixed(2)}`}
									</Typography>
								</Box>
								<Box className="order-table-row total-row">
									<Typography className="label">Total:</Typography>
									<Typography className="value">${total.toFixed(2)}</Typography>
								</Box>
								<Box className="order-table-row">
									<Typography className="label">Payment method:</Typography>
									<Typography className="value">{formatPaymentMethod(order.paymentMethod)}</Typography>
								</Box>
							</Box>
						</Box>
					</Box>
					<Box className="order-addresses">
						{!isDealer && (
							<Box className="address-card billing-address">
								<Typography className="address-title">Billing address</Typography>
								{billingAddress ? (
									<>
										{formatAddress(billingAddress, true).map((line, index) => (
											<Typography key={index} className="address-line">
												{line}
											</Typography>
										))}
										{email && <Typography className="address-line email">{email}</Typography>}
									</>
								) : (
									<Typography className="address-line">No billing address provided</Typography>
								)}
							</Box>
						)}

						<Box className="address-card shipping-address">
							<Typography className="address-title">Shipping address</Typography>
							{shippingAddress ? (
								<>
									{formatAddress(shippingAddress, false).map((line, index) => (
										<Typography key={index} className="address-line">
											{line}
										</Typography>
									))}
								</>
							) : (
								<Typography className="address-line">No shipping address provided</Typography>
							)}
						</Box>
					</Box>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(OrderDetailPage);
