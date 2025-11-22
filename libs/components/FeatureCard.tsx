import React from 'react';
import { Stack, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface FeatureCardProps {
	icon: SvgIconComponent | string;
	title: string;
	description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
	const IconComponent = typeof icon === 'string' ? null : icon;

	return (
		<Stack className="feature-card" direction="row">
			<Stack className="icon-box" direction="row" justifyContent="center" alignItems="center">
				{IconComponent ? (
					<IconComponent sx={{ fontSize: '40px', color: 'inherit' }} />
				) : (
					<img src={icon as string} alt={title} />
				)}
			</Stack>
			<Stack className="feature-content" direction="column">
				<Typography className="feature-title">{title}</Typography>
				<Typography className="feature-description">{description}</Typography>
			</Stack>
		</Stack>
	);
};

export default FeatureCard;
