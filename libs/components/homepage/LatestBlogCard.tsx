import React from 'react';
import { Stack, Box, Typography } from '@mui/material';

interface BlogPost {
	id: number;
	image: string;
	date: string;
	day: string;
	month: string;
	title: string;
	description: string;
}

interface LatestBlogCardProps {
	blog: BlogPost;
	readMoreHandler?: (blogId: number) => void;
}

const LatestBlogCard = ({ blog, readMoreHandler }: LatestBlogCardProps) => {
	return (
		<Stack className={'latest-blog-card'}>
			<Box className={'card-image-wrapper'}>
				<img src={blog.image} alt={blog.title} className={'blog-image'} />
				<Box className={'date-overlay'}>
					<Typography variant="h4" className={'date-day'}>
						{blog.day}
					</Typography>
					<Typography variant="body2" className={'date-month'}>
						{blog.month}
					</Typography>
				</Box>
			</Box>
			<Stack className={'card-content'}>
				<Typography variant="h6" className={'blog-title'}>
					{blog.title}
				</Typography>
				<Typography variant="body2" className={'blog-description'}>
					{blog.description}
				</Typography>
				<Box className={'read-more-btn'} onClick={() => readMoreHandler?.(blog.id)}>
					<Typography variant="body2" className={'read-more-text'}>
						+ Read More
					</Typography>
				</Box>
			</Stack>
		</Stack>
	);
};

export default LatestBlogCard;

