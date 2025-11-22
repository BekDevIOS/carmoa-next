import React, { useState } from 'react';
import { Stack, Typography, TextField, Checkbox, FormControlLabel, MenuItem, Select, FormControl } from '@mui/material';

interface AddressTableProps {
	title: string;
	showUseForBillingCheckbox?: boolean;
	onToggleUseForBillingSame?: (useSame: boolean) => void;
}

const AddressTable: React.FC<AddressTableProps> = ({
	title,
	showUseForBillingCheckbox = false,
	onToggleUseForBillingSame,
}) => {
	const [country, setCountry] = useState('South Korea');
	const [firstName, setFirstName] = useState('dsfsd');
	const [lastName, setLastName] = useState('sdfsd');
	const [address, setAddress] = useState('dsfd');
	const [apartment, setApartment] = useState('201호');
	const [city, setCity] = useState('sdfsd');
	const [postcode, setPostcode] = useState('52819');
	const [phone, setPhone] = useState('');
	const [useSameForBilling, setUseSameForBilling] = useState(true);

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

			{/* Country / Region */}
			<Stack className="field-group">
				<FormControl fullWidth>
					<Select
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						className="field-select"
						displayEmpty
					>
						<MenuItem value="" disabled>
							Country/Region
						</MenuItem>
						<MenuItem value="South Korea">South Korea</MenuItem>
						<MenuItem value="United States">United States</MenuItem>
						<MenuItem value="Japan">Japan</MenuItem>
						<MenuItem value="China">China</MenuItem>
					</Select>
				</FormControl>
			</Stack>

			{/* Name row */}
			<Stack className="field-row">
				<Stack className="field-group half">
					<TextField
						fullWidth
						label="First name"
						placeholder="First name"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
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
						required
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
						required
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

			{/* Phone */}
			<Stack className="field-group">
				<TextField
					fullWidth
					label="Phone (optional)"
					placeholder="Phone (optional)"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					className="field-input"
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


