import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import useDeviceDetect from '../../hooks/useDeviceDetect';


interface FreeShippingProgressProps {
	/** The minimum amount required for free shipping (e.g., 300) */
	threshold: number;
	/** The current cart total amount (e.g., 200) */
	current: number;
	/** Currency symbol to display (default: "$") */
	currency?: string;
}

const FreeShippingProgress: React.FC<FreeShippingProgressProps> = ({
	threshold,
	current,
	currency = '$',
}) => {
	const device = useDeviceDetect();
	const remaining = Math.max(threshold - current, 0);
	const progress = Math.min((current / threshold) * 100, 100);
	const isFreeShippingEarned = current >= threshold;

	if (device === 'mobile') {
		return (
			<Box className="free-shipping-progress">
				<Stack spacing={1.2}>
					{/* Header Row */}
					<Box className="shipping-header">
						<LocalShippingOutlinedIcon className="shipping-icon" />
						<Typography className="shipping-title">
							FREE SHIPPING ON ORDER{' '}
							<span className="shipping-threshold">
								{currency}
								{threshold.toFixed(2)}
							</span>
						</Typography>
					</Box>

					{/* Message Row */}
					<Typography className="shipping-message">
						{isFreeShippingEarned ? (
							<>
								🎉 <strong>Congratulations!</strong> You've earned <strong>Free Shipping!</strong>
							</>
						) : (
							<>
								Spend <strong>{currency}{remaining.toFixed(2)}</strong> more and get{' '}
								<strong>Free Shipping!</strong>
							</>
						)}
					</Typography>

					{/* Progress Bar Row */}
					<Box className="shipping-progress-wrapper">
						<Box className="shipping-progress-track">
							<Box
								className="shipping-progress-fill"
								sx={{
									width: `${progress}%`,
								}}
							>
								<Box className="shipping-progress-stripes" />
							</Box>
						</Box>

						{/* Truck Icon Bubble */}
						<Box
							className="shipping-truck-bubble"
							sx={{
								left: `${progress}%`,
							}}
						>
							<LocalShippingOutlinedIcon />
						</Box>
					</Box>
				</Stack>
			</Box>
		);
	} else {
		return (
			<Box className="free-shipping-progress">
				<Stack spacing={1.5}>
					{/* Header Row */}
					<Box className="shipping-header">
						<LocalShippingOutlinedIcon className="shipping-icon" />
						<Typography className="shipping-title">
							FREE SHIPPING ON ORDER{' '}
							<span className="shipping-threshold">
								{currency}
								{threshold.toFixed(2)}
							</span>
						</Typography>
					</Box>

					{/* Message Row */}
					<Typography className="shipping-message">
						{isFreeShippingEarned ? (
							<>
								🎉 <strong>Congratulations!</strong> You've earned <strong>Free Shipping!</strong>
							</>
						) : (
							<>
								Spend <strong>{currency}{remaining.toFixed(2)}</strong> more and get{' '}
								<strong>Free Shipping!</strong>
							</>
						)}
					</Typography>

					{/* Progress Bar Row */}
					<Box className="shipping-progress-wrapper">
						<Box className="shipping-progress-track">
							<Box
								className="shipping-progress-fill"
								sx={{
									width: `${progress}%`,
								}}
							>
								<Box className="shipping-progress-stripes" />
							</Box>
						</Box>

						{/* Truck Icon Bubble */}
						<Box
							className="shipping-truck-bubble"
							sx={{
								left: `${progress}%`,
							}}
						>
							<LocalShippingOutlinedIcon />
						</Box>
					</Box>
				</Stack>
			</Box>
		);
	}
};

export default FreeShippingProgress;

