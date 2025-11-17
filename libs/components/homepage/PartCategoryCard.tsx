import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';

interface PartCategoryCardProps {
	image: string;
	hoverImage?: string;
	title: string;
}

const PartCategoryCard = ({ image, hoverImage, title }: PartCategoryCardProps) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Stack
			className={'part-category-card'}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
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
};

export default PartCategoryCard;

