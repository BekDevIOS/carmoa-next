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
	rating?: number | null;
}

interface ReviewProps {
	comment: Comment;
	// Optional explicit rating override; if not provided, falls back to comment.rating.
	rating?: number | null;
}

const Review = (props: ReviewProps) => {
	const { comment, rating } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const imagePath: string = getMemberImageUrl(comment?.memberData?.memberImage);

	const effectiveRating =
		typeof rating === 'number'
			? rating
			: typeof comment.rating === 'number'
			? comment.rating
			: undefined;

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
								{typeof effectiveRating === 'number' && effectiveRating > 0 && (
									<Stack className={'star-rating'}>
										{[1, 2, 3, 4, 5].map((star) => (
											<Box key={star} className={'star-icon'}>
												{star <= effectiveRating ? (
													<StarIcon className={'star-filled'} />
												) : (
													<StarBorderIcon className={'star-empty'} />
												)}
											</Box>
										))}
									</Stack>
								)}
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
