import React from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface FeatureCardProps {
	icon: string;
	title: string;
	description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="feature-card">
				<Stack className="icon-box">
					<img src={icon} alt={title} />
				</Stack>
				<Typography className="feature-title">{title}</Typography>
				<Typography className="feature-description">{description}</Typography>
			</Stack>
		);
	} else {
		return (
			<Stack className="feature-card">
				<Stack className="icon-box">
					<img src={icon} alt={title} />
				</Stack>
				<Typography className="feature-title">{title}</Typography>
				<Typography className="feature-description">{description}</Typography>
			</Stack>
		);
	}
};

export default FeatureCard;

