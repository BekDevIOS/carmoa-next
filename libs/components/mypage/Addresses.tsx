import React, { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography } from '@mui/material';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { MemberUpdate } from '../../types/member/member.update';
import { MemberShippingAddress, MemberBillingAddress } from '../../types/member/member';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { sweetErrorHandling, sweetMixinSuccessAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { Messages } from '../../config';
import AddressTable from '../order/AddressTable';

const Addresses: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [shippingAddress, setShippingAddress] = useState<MemberShippingAddress | undefined>(
		user.memberShippingAddress
	);
	const [billingAddress, setBillingAddress] = useState<MemberBillingAddress | undefined>(
		user.memberBillingAddress
	);
	console.log(shippingAddress, billingAddress);
	console.log(user.memberShippingAddress, user.memberBillingAddress);

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		setShippingAddress(user.memberShippingAddress);
		setBillingAddress(user.memberBillingAddress);
	}, [user]);

	/** HANDLERS **/
	const handleShippingChange = useCallback((data: MemberShippingAddress) => {
		setShippingAddress(data);
	}, []);

	const handleBillingChange = useCallback((data: MemberBillingAddress) => {
		setBillingAddress(data);
	}, []);

	const handleUpdate = useCallback(async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);

			// Validate shipping address (always required)
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

			const updateData: MemberUpdate = {
				_id: user._id,
				memberShippingAddress: shippingAddress,
				memberBillingAddress: hasBillingData ? billingAddress : undefined,
			};

			const result = await updateMember({
				variables: {
					input: updateData,
				},
			});

			// @ts-ignore
			const jwtToken = result.data.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(result.data.updateMember?.accessToken);
			await sweetMixinSuccessAlert('Addresses updated successfully.');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [user._id, shippingAddress, billingAddress, updateMember]);

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
						<AddressTable
							title="Billing address"
							type="billing"
							billingData={billingAddress}
							onBillingChange={handleBillingChange}
						/>
						<AddressTable
							title="Shipping address"
							type="shipping"
							shippingData={shippingAddress}
							onShippingChange={handleShippingChange}
						/>
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

