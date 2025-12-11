import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/blog/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface BlogCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler?: any;
}

const BlogCard = (props: BlogCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/blog/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return (
			<Stack
				className="community-blog-card mobile"
				onClick={(e) => chooseArticleHandler(e, boardArticle)}
				sx={{ width: '100%', cursor: 'pointer' }}
			>
				{/* IMAGE WITH CATEGORY BADGE */}
				<Stack className="image-box mobile">
					<img src={imagePath} alt={boardArticle?.articleTitle} className="card-img mobile" />
					<Stack className="category-badge mobile">
						<Typography className="category-text mobile">{boardArticle?.articleCategory}</Typography>
					</Stack>
				</Stack>

				{/* CONTENT */}
				<Stack className="content-box mobile">
					{/* AUTHOR AND DATE */}
					<Stack className="author-section mobile">
						<Typography
							className="author mobile"
							onClick={(e) => {
								e.stopPropagation();
								goMemberPage(boardArticle?.memberData?._id as string);
							}}
						>
							{boardArticle?.memberData?.memberNick}
						</Typography>
						<Typography className="date mobile">
							<Moment format={'MMM DD, YYYY'}>{boardArticle?.createdAt}</Moment>
						</Typography>
					</Stack>

					{/* TITLE */}
					<Typography className="title mobile">{boardArticle?.articleTitle}</Typography>

					{/* STATS */}
					<Stack className="stats mobile">
						<Stack className="stat-item mobile">
							<RemoveRedEyeIcon className="icon mobile" />
							<Typography className="stat-text mobile">{boardArticle?.articleViews || 0}</Typography>
						</Stack>
						<Stack
							className="stat-item mobile"
							onClick={(e) => {
								e.stopPropagation();
								if (typeof likeArticleHandler === 'function') {
									likeArticleHandler(e, user, boardArticle?._id);
								}
							}}
						>
							{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon className="icon mobile liked" />
							) : (
								<FavoriteBorderIcon className="icon mobile" />
							)}
							<Typography className="stat-text mobile">{boardArticle?.articleLikes || 0}</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack
				sx={{ width: '292px'}}
				className="community-blog-card"
				onClick={(e) => chooseArticleHandler(e, boardArticle)}
			>
				{/* BIG FULL-WIDTH IMAGE */}
				<Stack className="image-box">
					<img src={imagePath} alt="" className="card-img" />
					<Stack className="category-badge">
						<Typography className="category-text">{boardArticle?.articleCategory}</Typography>
					</Stack>
				</Stack>

				{/* CONTENT */}
				<Stack className="content-box">
					{/* AUTHOR AND DATE */}
					<Stack className="author-section">
						<Typography
							className="author"
							onClick={(e) => {
								e.stopPropagation();
								goMemberPage(boardArticle?.memberData?._id as string);
							}}
						>
							{boardArticle?.memberData?.memberNick}
						</Typography>
						<Typography className="date">
							<Moment format={'MMMM DD, YYYY'}>{boardArticle?.createdAt}</Moment>
						</Typography>
					</Stack>

					{/* TITLE */}
					<Typography className="title">{boardArticle?.articleTitle}</Typography>

					{/* STATS - HORIZONTAL */}
					<Stack className="stats">
						<Stack className="stat-item">
							<RemoveRedEyeIcon className="icon" />
							<Typography>{boardArticle?.articleViews}</Typography>
						</Stack>

						<Stack
							className="stat-item"
							onClick={(e) => {
								if (typeof likeArticleHandler === 'function') {
									likeArticleHandler(e, user, boardArticle?._id);
								}
							}}
						>
							{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon className="icon liked" />
							) : (
								<FavoriteBorderIcon className="icon" />
							)}
							<Typography>{boardArticle?.articleLikes}</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default BlogCard;
