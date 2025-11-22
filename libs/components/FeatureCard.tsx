import React from 'react';
import { Stack, Typography } from '@mui/material';

interface FeatureCardProps {
	icon: string;
	title: string;
	description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
	return (
		<Stack className="feature-card" direction="row">
			<Stack className="icon-box" direction="row" justifyContent="center" alignItems="center">
				<img src={icon} alt={title} />
			</Stack>
			<Stack className="feature-content" direction="column">
				<Typography className="feature-title">{title}</Typography>
				<Typography className="feature-description">{description}</Typography>
			</Stack>
		</Stack>
	);
};

export default FeatureCard;
