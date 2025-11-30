import React, { useState, useEffect, useCallback } from 'react';
import { Stack, Typography, TextField, Checkbox, FormControlLabel, MenuItem, Select, FormControl } from '@mui/material';
import { MemberShippingAddress, MemberBillingAddress } from '../../types/member/member';

interface AddressTableProps {
	title: string;
	type: 'shipping' | 'billing';
	showUseForBillingCheckbox?: boolean;
	onToggleUseForBillingSame?: (useSame: boolean) => void;
	shippingData?: MemberShippingAddress;
	billingData?: MemberBillingAddress;
	onShippingChange?: (data: MemberShippingAddress) => void;
	onBillingChange?: (data: MemberBillingAddress) => void;
}

const COUNTRIES = [
	'South Korea',
	'China',
	'Japan',
	'Russia',
	'Mongolia',
	'Taiwan',
	'Philippines',
	'Vietnam',
	'Thailand',
	'Singapore',
	'Malaysia',
];

const AddressTable: React.FC<AddressTableProps> = ({
	title,
	type,
	showUseForBillingCheckbox = false,
	onToggleUseForBillingSame,
	shippingData,
	billingData,
	onShippingChange,
	onBillingChange,
}) => {
	const isBilling = type === 'billing';
	const addressData = isBilling ? billingData : shippingData;

	// Initialize state with existing data
	const [country, setCountry] = useState(
		isBilling && billingData?.country ? billingData.country : 'South Korea'
	);
	const [firstName, setFirstName] = useState(addressData?.firstName || '');
	const [lastName, setLastName] = useState(addressData?.lastName || '');
	const [address, setAddress] = useState(addressData?.address1 || '');
	const [apartment, setApartment] = useState(addressData?.address2 || '');
	const [city, setCity] = useState(addressData?.city || '');
	const [postcode, setPostcode] = useState(addressData?.postalCode || '');
	const [phone, setPhone] = useState(addressData?.phone || '');
	const [useSameForBilling, setUseSameForBilling] = useState(true);

	// Update local state when props change
	useEffect(() => {
		if (addressData) {
			if (isBilling) {
				const billing = addressData as MemberBillingAddress;
				if (billing.country) {
					setCountry(billing.country);
				}
			}
			setFirstName(addressData.firstName || '');
			setLastName(addressData.lastName || '');
			setAddress(addressData.address1 || '');
			setApartment(addressData.address2 || '');
			setCity(addressData.city || '');
			setPostcode(addressData.postalCode || '');
			setPhone(addressData.phone || '');
		} else {
			// Reset to empty if no data
			if (isBilling) {
				setCountry('South Korea');
			}
			setFirstName('');
			setLastName('');
			setAddress('');
			setApartment('');
			setCity('');
			setPostcode('');
			setPhone('');
		}
	}, [addressData, isBilling]);

	// Notify parent of changes when user types
	const notifyChange = useCallback(() => {
		if (isBilling && onBillingChange) {
			onBillingChange({
				country,
				firstName,
				lastName,
				address1: address,
				address2: apartment,
				city,
				postalCode: postcode,
				phone,
			});
		} else if (!isBilling && onShippingChange) {
			onShippingChange({
				firstName,
				lastName,
				address1: address,
				address2: apartment,
				city,
				postalCode: postcode,
				phone,
			});
		}
	}, [country, firstName, lastName, address, apartment, city, postcode, phone, isBilling, onShippingChange, onBillingChange]);

	// Notify on change with debounce effect
	useEffect(() => {
		const timer = setTimeout(() => {
			notifyChange();
		}, 300);
		return () => clearTimeout(timer);
	}, [notifyChange]);

	const handleToggleUseForBilling = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		setUseSameForBilling(checked);
		onToggleUseForBillingSame?.(checked);
	};

	return (
		<Stack className="address-card">
			<Typography className="section-heading">{title}</Typography>
			<Typography className="section-subtitle">
				Enter the address where you want your order delivered.
			</Typography>

			{/* Country / Region - Only show for billing address, required */}
			{isBilling && (
				<Stack className="field-group">
					<FormControl fullWidth required>
						<Select
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							className="field-select"
							displayEmpty
							required
						>
						<MenuItem value="" disabled>
							Country/Region
						</MenuItem>
						{COUNTRIES.map((countryName) => (
							<MenuItem key={countryName} value={countryName}>
								{countryName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Stack>
			)}

			{/* Name row */}
			<Stack className="field-row">
				<Stack className="field-group half">
					<TextField
						fullWidth
						label="First name"
						placeholder="First name"
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value);
						}}
						className="field-input"
						required
					/>
				</Stack>
				<Stack className="field-group half">
					<TextField
						fullWidth
						label="Last name"
						placeholder="Last name"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className="field-input"
					/>
				</Stack>
			</Stack>

			{/* Address */}
			<Stack className="field-group">
				<TextField
					fullWidth
					label="Address"
					placeholder="Address"
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					className="field-input"
					required
				/>
			</Stack>

			{/* Apartment */}
			<Stack className="field-group">
				<TextField
					fullWidth
					label="Apartment, suite, etc. (optional)"
					placeholder="Apartment, suite, etc. (optional)"
					value={apartment}
					onChange={(e) => setApartment(e.target.value)}
					className="field-input"
				/>
			</Stack>

			{/* City + Postal code */}
			<Stack className="field-row">
				<Stack className="field-group half">
					<TextField
						fullWidth
						label="City"
						placeholder="City"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						className="field-input"
					/>
				</Stack>
				<Stack className="field-group half">
					<TextField
						fullWidth
						label="Postal code"
						placeholder="Postal code"
						value={postcode}
						onChange={(e) => setPostcode(e.target.value)}
						className="field-input"
						required
					/>
				</Stack>
			</Stack>

			{/* Phone - Required for shipping, optional for billing */}
			<Stack className="field-group">
				<TextField
					fullWidth
					label={isBilling ? 'Phone (optional)' : 'Phone'}
					placeholder={isBilling ? 'Phone (optional)' : 'Phone'}
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					className="field-input"
					required={!isBilling}
				/>
			</Stack>

			{showUseForBillingCheckbox && (
				<FormControlLabel
					className="billing-checkbox"
					control={<Checkbox checked={useSameForBilling} onChange={handleToggleUseForBilling} />}
					label="Use same address for billing"
				/>
			)}
		</Stack>
	);
};

export default AddressTable;


