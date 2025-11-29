import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { getMemberImageUrl } from '../../config';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';

interface CommentMemberData {
	memberImage?: string;
	memberNick?: string;
	_id?: string;
}

interface Comment {
	memberData?: CommentMemberData;
	commentContent: string;
	createdAt: string | Date;
	_id?: string;
}

interface ReviewProps {
	comment: Comment;
	rating?: number; // Optional rating (1-5)
}

const Review = (props: ReviewProps) => {
	const { comment, rating = 5 } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const imagePath: string = getMemberImageUrl(comment?.memberData?.memberImage);

	/** HANDLERS **/
	const goMemberPage = (id?: string) => {
		if (!id) return;
		router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') {
		return <div>REVIEW</div>;
	} else {
		return (
			<Stack className={'product-review'}>
				<Stack className={'review-header'}>
					<Stack className={'review-user-info'}>
						<Box className={'user-avatar'}>
							<img src={imagePath} alt={comment.memberData?.memberNick || 'User'} />
						</Box>
						<Stack className={'user-details'}>
							<Typography className={'user-name'} onClick={() => goMemberPage(comment?.memberData?._id as string)}>
								{comment.memberData?.memberNick || 'Anonymous'}
							</Typography>
							<Stack className={'review-meta'}>
								<Stack className={'star-rating'}>
									{[1, 2, 3, 4, 5].map((star) => (
										<Box key={star} className={'star-icon'}>
											{star <= rating ? (
												<StarIcon className={'star-filled'} />
											) : (
												<StarBorderIcon className={'star-empty'} />
											)}
										</Box>
									))}
								</Stack>
								<Typography className={'review-date'}>
									<Moment format={'MMMM DD, YYYY'}>{comment.createdAt}</Moment>
								</Typography>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'review-content'}>
					<Typography className={'review-text'}>{comment.commentContent}</Typography>
				</Stack>
			</Stack>
		);
	}
};

export default Review;
