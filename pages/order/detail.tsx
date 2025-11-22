import React from 'react';
import { NextPage } from 'next';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { T } from '../../libs/types/common';

const OrderDetailPage: NextPage = (props: T) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ORDER DETAIL PAGE MOBILE</div>;
	}

	return (
		<div id="order-detail-page">
			<div className="container">
				<Stack className="order-confirmation">
					<Typography className="order-confirmation-title">
          Order Overview
					</Typography>

					<Stack className="order-meta" >
						<Stack className="order-meta-item">
							<Typography className="label">Order number:</Typography>
							<Typography className="value">13606</Typography>
						</Stack>
						<Stack className="order-meta-item">
							<Typography className="label">Date:</Typography>
							<Typography className="value">November 21, 2025</Typography>
						</Stack>
						<Stack className="order-meta-item">
							<Typography className="label">Email:</Typography>
							<Typography className="value">umekhmomonboev@gmail.com</Typography>
						</Stack>
						<Stack className="order-meta-item">
							<Typography className="label">Total:</Typography>
							<Typography className="value">$532.00</Typography>
						</Stack>
						<Stack className="order-meta-item">
							<Typography className="label">Payment method:</Typography>
							<Typography className="value">Direct bank transfer</Typography>
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
								<Box className="order-table-row product-row">
									<Typography className="product-name">
										Black Decker 20V Li Ion Compact Cordless Electric Hand Drill × 2
									</Typography>
									<Typography className="product-total">$532.00</Typography>
								</Box>

								<Box className="order-table-row">
									<Typography className="label">Subtotal:</Typography>
									<Typography className="value">$532.00</Typography>
								</Box>

								<Box className="order-table-row">
									<Typography className="label">Shipping:</Typography>
									<Typography className="value">Free shipping</Typography>
								</Box>

								<Box className="order-table-row total-row">
									<Typography className="label">Total:</Typography>
									<Typography className="value">$532.00</Typography>
								</Box>

								<Box className="order-table-row">
									<Typography className="label">Payment method:</Typography>
									<Typography className="value">Direct bank transfer</Typography>
								</Box>
							</Box>
						</Box>
					</Box>

					<Box className="order-addresses">
						<Box className="address-card billing-address">
							<Typography className="address-title">Billing address</Typography>
							<Typography className="address-line">dfsfd sdfsd</Typography>
							<Typography className="address-line">dsfd</Typography>
							<Typography className="address-line">201호</Typography>
							<Typography className="address-line">sdfsd</Typography>
							<Typography className="address-line">52819</Typography>
							<Typography className="address-line">South Korea</Typography>
							<Typography className="address-line email">umekhmomonboev@gmail.com</Typography>
						</Box>

						<Box className="address-card shipping-address">
							<Typography className="address-title">Shipping address</Typography>
							<Typography className="address-line">dfsfd sdfsd</Typography>
							<Typography className="address-line">dsfd</Typography>
							<Typography className="address-line">201호</Typography>
							<Typography className="address-line">sdfsd</Typography>
							<Typography className="address-line">52819</Typography>
							<Typography className="address-line">South Korea</Typography>
						</Box>
					</Box>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(OrderDetailPage);


