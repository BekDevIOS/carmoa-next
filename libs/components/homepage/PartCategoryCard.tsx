import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
interface PartCategoryCardProps {
	image: string;
	hoverImage?: string;
	title: string;
	onClick?: () => void;
}

const PartCategoryCard = ({ image, hoverImage, title, onClick }: PartCategoryCardProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const device = useDeviceDetect();
	if (device === 'mobile') {
		return (
			<Stack
				className="mobile-part-category-card"
				onClick={onClick}
				sx={{ cursor: onClick ? 'pointer' : 'default' }}
			>
				<Box className="mobile-card-image">
					<img src={image} alt={title} />
					<Box className="mobile-card-overlay" />
					<Typography className="mobile-card-title">{title}</Typography>
				</Box>
			</Stack>
		);
	} else {
	return (
		<Stack
			className={'part-category-card'}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
			sx={{ cursor: onClick ? 'pointer' : 'default' }}
		>
			<Box className={'card-image-wrapper'}>
				<img
					src={isHovered && hoverImage ? hoverImage : image}
					alt={title}
					className={'card-image'}
				/>
			</Box>
			<Typography variant="body1" className={'card-title'} sx={{ color: 'text.primary' }}>
				{title}
			</Typography>
		</Stack>
		);
	}
};

export default PartCategoryCard;

