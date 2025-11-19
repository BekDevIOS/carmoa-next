import React from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

interface RecentPostCardProps {
	image: string;
	category: string;
	title: string;
	articleId?: string;
}

const RecentPostCard = ({ image, category, title, articleId }: RecentPostCardProps) => {
	const router = useRouter();

	const handleClick = () => {
		if (articleId) {
			router.push({
				pathname: '/blog/detail',
				query: { id: articleId },
			});
		}
	};

	return (
		<Stack className="recent-post-card" direction="row" onClick={handleClick}>
			<Stack className="recent-image-box">
				<img src={image} alt={title} className="recent-img" />
			</Stack>
			<Stack className="recent-content">
				<Stack className="recent-category-badge">
					<Typography className="recent-category-text">{category}</Typography>
				</Stack>
				<Typography className="recent-title">{title}</Typography>
			</Stack>
		</Stack>
	);
};

export default RecentPostCard;

