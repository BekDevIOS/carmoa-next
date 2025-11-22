import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import AddressTable from '../order/AddressTable';

const Addresses: NextPage = () => {
	const device = useDeviceDetect();

	const handleUpdate = () => {
		// Handle update logic here
		console.log('Update addresses');
	};

	if (device === 'mobile') {
		return <>ADDRESSES PAGE MOBILE</>;
	} else {
		return (
			<div id="addresses-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Addresses</Typography>
						<Typography className="sub-title">
							The following addresses will be used on the checkout page by default.
						</Typography>
					</Stack>
				</Stack>
				<Stack className="addresses-container">
					<Stack className="addresses-row">
						<AddressTable title="Billing address" />
						<AddressTable title="Shipping address" />
					</Stack>
					<Stack className="update-button-container">
						<Button className="update-button" onClick={handleUpdate}>
							<Typography>Update Addresses</Typography>
						</Button>
					</Stack>
				</Stack>
			</div>
		);
	}
};

export default Addresses;

