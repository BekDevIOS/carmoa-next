import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/blog/board-article';
import RecentPostCard from '../../libs/components/blog/RecentPostCard';
import { TabContext, TabList } from '@mui/lab';
const ToastViewerComponent = dynamic(() => import('../../libs/components/blog/TViewer'), { ssr: false });

// export const getStaticProps = async ({ locale }: any) => ({
// 	props: {
// 		...(await serverSideTranslations(locale, ['common'])),
// 	},
// });

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/logo/logoText.svg');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>({
		_id: '1',
		articleCategory: 'REVIEWS' as any,
		articleStatus: 'ACTIVE' as any,
		articleTitle: '2024 Tesla Model 3 Performance Review: The Electric Revolution Continues',
		articleContent: `# Introduction

The 2024 Tesla Model 3 Performance represents the pinnacle of electric vehicle engineering, combining blistering acceleration with cutting-edge technology and impressive efficiency. After spending two weeks with this electric sedan, I can confidently say it's redefined what we should expect from performance cars in the modern era.

## Performance That Defies Belief

Let's start with the numbers that matter. The dual-motor all-wheel-drive setup produces a combined 450 horsepower, launching this sedan from 0-60 mph in just 3.1 seconds. That's supercar territory, folks. The instant torque delivery is something you need to experience to believe - there's zero lag, just pure, relentless acceleration that pins you to your seat.

### Handling and Dynamics

What impressed me most wasn't just the straight-line speed, but how well this car handles. The low center of gravity, thanks to the battery pack placement, gives the Model 3 Performance a planted, stable feel through corners. The adaptive suspension does an excellent job of balancing comfort and sportiness.

## Technology and Interior

The minimalist interior is dominated by the 15.4-inch central touchscreen, which controls virtually every function. While it takes some getting used to, the interface is intuitive and responsive. The build quality has improved significantly over earlier models, with better materials and tighter panel gaps.

### Autopilot and FSD

Tesla's Autopilot system continues to be one of the most advanced driver assistance systems available. Navigate on Autopilot works flawlessly on highways, and the Full Self-Driving capability (optional) shows promise for the future.

## Range and Charging

With an EPA-estimated range of 315 miles, range anxiety is becoming a thing of the past. The extensive Supercharger network makes long-distance travel surprisingly convenient. During my test, I averaged about 290 miles of real-world range, which is more than sufficient for daily driving.

## Final Verdict

The 2024 Tesla Model 3 Performance isn't just a great electric car - it's a great car, period. At $54,990, it offers performance that would cost twice as much from traditional manufacturers. If you're ready to make the switch to electric, this is the car that will make you wonder why you waited so long.

**Rating: 9.5/10**

**Pros:**
- Incredible acceleration and handling
- Extensive Supercharger network
- Advanced technology features
- Low running costs

**Cons:**
- Firm ride on rough roads
- Touch screen for everything takes getting used to
- Build quality still not quite up to luxury standards`,
		articleImage: '/img/banner/cities/BUSAN.webp',
		articleViews: 3420,
		articleLikes: 287,
		articleComments: 5,
		memberId: 'member1',
		createdAt: new Date('2024-11-18T10:30:00'),
		updatedAt: new Date('2024-11-18T10:30:00'),
		memberData: {
			_id: 'member1',
			memberNick: 'AutoExpert_Mike',
			memberImage: '/img/logo/logoText.svg',
			memberType: 'USER' as any,
			memberStatus: 'ACTIVE' as any,
			memberAuthType: 'EMAIL' as any,
			memberPhone: '+1234567890',
			memberFullName: 'Mike Johnson',
			memberProperties: 0,
			memberRank: 5,
			memberArticles: 24,
			memberPoints: 1250,
			memberLikes: 890,
			memberViews: 15420,
			memberComments: 342,
			memberWarnings: 0,
			memberBlocks: 0,
			createdAt: new Date('2023-05-10'),
			updatedAt: new Date('2024-11-18'),
		},
		meLiked: [
			{
				memberId: 'currentUser',
				likeRefId: '1',
				myFavorite: true,
			},
		],
	});

	const [comments, setComments] = useState<Comment[]>([
		{
			_id: 'comment1',
			commentStatus: 'ACTIVE' as any,
			commentGroup: 'ARTICLE' as any,
			commentContent:
				'Great review! I just ordered my Model 3 Performance last week and this makes me even more excited to receive it. The acceleration numbers are insane!',
			commentRefId: '1',
			memberId: 'member2',
			createdAt: new Date('2024-11-18T11:15:00'),
			updatedAt: new Date('2024-11-18T11:15:00'),
			memberData: {
				_id: 'member2',
				memberNick: 'EVEnthusiast2024',
				memberImage: '/img/logo/logoText.svg',
				memberType: 'USER' as any,
				memberStatus: 'ACTIVE' as any,
				memberAuthType: 'EMAIL' as any,
				memberPhone: '+1234567891',
				memberFullName: 'Sarah Chen',
				memberProperties: 0,
				memberRank: 3,
				memberArticles: 5,
				memberPoints: 320,
				memberLikes: 145,
				memberViews: 2340,
				memberComments: 89,
				memberWarnings: 0,
				memberBlocks: 0,
				createdAt: new Date('2024-01-15'),
				updatedAt: new Date('2024-11-18'),
			},
		},
		{
			_id: 'comment2',
			commentStatus: 'ACTIVE' as any,
			commentGroup: 'ARTICLE' as any,
			commentContent: "How does it compare to the BMW M3 in terms of handling? I'm torn between the two.",
			commentRefId: '1',
			memberId: 'member3',
			createdAt: new Date('2024-11-18T12:45:00'),
			updatedAt: new Date('2024-11-18T12:45:00'),
			memberData: {
				_id: 'member3',
				memberNick: 'BimmerFan',
				memberImage: '/img/logo/logoText.svg',
				memberType: 'USER' as any,
				memberStatus: 'ACTIVE' as any,
				memberAuthType: 'EMAIL' as any,
				memberPhone: '+1234567892',
				memberFullName: 'David Martinez',
				memberProperties: 1,
				memberRank: 4,
				memberArticles: 12,
				memberPoints: 670,
				memberLikes: 234,
				memberViews: 5680,
				memberComments: 156,
				memberWarnings: 0,
				memberBlocks: 0,
				createdAt: new Date('2023-08-20'),
				updatedAt: new Date('2024-11-18'),
			},
		},
		{
			_id: 'comment3',
			commentStatus: 'ACTIVE' as any,
			commentGroup: 'ARTICLE' as any,
			commentContent:
				'The build quality concerns are real. I had panel gap issues with my 2023 model. Has it really improved?',
			commentRefId: '1',
			memberId: 'member4',
			createdAt: new Date('2024-11-18T14:20:00'),
			updatedAt: new Date('2024-11-18T14:20:00'),
			memberData: {
				_id: 'member4',
				memberNick: 'TeslaOwner2023',
				memberImage: '/img/logo/logoText.svg',
				memberType: 'USER' as any,
				memberStatus: 'ACTIVE' as any,
				memberAuthType: 'EMAIL' as any,
				memberPhone: '+1234567893',
				memberFullName: 'Emily Watson',
				memberProperties: 0,
				memberRank: 4,
				memberArticles: 8,
				memberPoints: 450,
				memberLikes: 178,
				memberViews: 3240,
				memberComments: 92,
				memberWarnings: 0,
				memberBlocks: 0,
				createdAt: new Date('2023-06-12'),
				updatedAt: new Date('2024-11-18'),
			},
		},
		{
			_id: 'comment4',
			commentStatus: 'ACTIVE' as any,
			commentGroup: 'ARTICLE' as any,
			commentContent:
				'Excellent write-up! The charging network is definitely a huge advantage. Road trips in my Model 3 have been a breeze.',
			commentRefId: '1',
			memberId: 'member5',
			createdAt: new Date('2024-11-18T15:50:00'),
			updatedAt: new Date('2024-11-18T15:50:00'),
			memberData: {
				_id: 'member5',
				memberNick: 'RoadTripKing',
				memberImage: '/img/logo/logoText.svg',
				memberType: 'USER' as any,
				memberStatus: 'ACTIVE' as any,
				memberAuthType: 'EMAIL' as any,
				memberPhone: '+1234567894',
				memberFullName: 'James Anderson',
				memberProperties: 0,
				memberRank: 5,
				memberArticles: 18,
				memberPoints: 920,
				memberLikes: 456,
				memberViews: 8920,
				memberComments: 234,
				memberWarnings: 0,
				memberBlocks: 0,
				createdAt: new Date('2023-03-05'),
				updatedAt: new Date('2024-11-18'),
			},
		},
		{
			_id: 'comment5',
			commentStatus: 'ACTIVE' as any,
			commentGroup: 'ARTICLE' as any,
			commentContent: '3.1 seconds 0-60 is absolutely mental for a family sedan. The future is here!',
			commentRefId: '1',
			memberId: 'member6',
			createdAt: new Date('2024-11-18T17:30:00'),
			updatedAt: new Date('2024-11-18T17:30:00'),
			memberData: {
				_id: 'member6',
				memberNick: 'SpeedDemon88',
				memberImage: '/img/logo/logoText.svg',
				memberType: 'USER' as any,
				memberStatus: 'ACTIVE' as any,
				memberAuthType: 'EMAIL' as any,
				memberPhone: '+1234567895',
				memberFullName: 'Alex Thompson',
				memberProperties: 0,
				memberRank: 3,
				memberArticles: 6,
				memberPoints: 280,
				memberLikes: 98,
				memberViews: 1560,
				memberComments: 45,
				memberWarnings: 0,
				memberBlocks: 0,
				createdAt: new Date('2024-02-28'),
				updatedAt: new Date('2024-11-18'),
			},
		},
	]);
	const [total, setTotal] = useState<number>(5);

	// Recent posts data
	const recentPosts = [
		{
			id: '4',
			image: '/img/banner/cities/BUSAN.webp',
			category: 'BLOG',
			title: 'Aliquam efficitur dolor',
		},
		{
			id: '5',
			image: '/img/banner/cities/BUSAN.webp',
			category: 'BLOG',
			title: 'Sed et quam quis',
		},
		{
			id: '6',
			image: '/img/banner/cities/BUSAN.webp',
			category: 'BLOG',
			title: 'Sed mattis est libero',
		},
	];

	/** APOLLO REQUESTS **/

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/blog',
				query: { articleCategory: value },
			},
			'/blog',
			{ shallow: true },
		);
	};

	const creteCommentHandler = async () => {};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return imageUrl;
		else return '/img/logo/logoText.svg';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>COMMUNITY DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<div id="community-detail-page">
				<div className="container">
					<Stack className="main-box">
						<div className="community-detail-config">
							<Stack className="title-box">
								<Stack className="left">
									<Typography className="title">{articleCategory} BOARD</Typography>
									<Typography className="sub-title">
										Express your opinions freely here without content restrictions
									</Typography>
								</Stack>
								<Button
									onClick={() =>
										router.push({
											pathname: '/mypage',
											query: {
												category: 'writeArticle',
											},
										})
									}
									className="right"
								>
									Write
								</Button>
							</Stack>
							<div className="config">
								<Stack className="first-box-config">
									<Stack className="content-and-info">
										<Stack className="content">
											<Typography className="content-data">{boardArticle?.articleTitle}</Typography>
											<Stack className="member-info">
												<img
													src={memberImage}
													alt=""
													className="member-img"
													onClick={() => goMemberPage(boardArticle?.memberData?._id)}
												/>
												<Typography className="member-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
													{boardArticle?.memberData?.memberNick}
												</Typography>
												<Stack className="divider"></Stack>
												<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
													{boardArticle?.createdAt}
												</Moment>
											</Stack>
										</Stack>
										<Stack className="info">
											<Stack className="icon-info">
												{boardArticle?.meLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}

												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												<VisibilityIcon />
												<Typography className="text">{boardArticle?.articleViews}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												{boardArticle?.articleComments && boardArticle?.articleComments > 0 ? (
													<ChatIcon />
												) : (
													<ChatBubbleOutlineRoundedIcon />
												)}

												<Typography className="text">{boardArticle?.articleComments}</Typography>
											</Stack>
										</Stack>
									</Stack>
									<Stack>
										<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
									</Stack>
									<Stack className="like-and-dislike">
										<Stack className="top">
											<Button>
												{boardArticle?.meLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>
								<Stack
									className="second-box-config"
									sx={{ borderBottom: total > 0 ? 'none' : '1px solid #eee', border: '1px solid #eee' }}
								>
									<Typography className="title-text">Comments ({total})</Typography>
									<Stack className="leave-comment">
										<input
											type="text"
											placeholder="Leave a comment"
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
										<Stack className="button-box">
											<Typography>{wordsCnt}/100</Typography>
											<Button onClick={creteCommentHandler}>comment</Button>
										</Stack>
									</Stack>
								</Stack>
								{total > 0 && (
									<Stack className="comments">
										<Typography className="comments-title">Comments</Typography>
									</Stack>
								)}
								{comments?.map((commentData, index) => {
									return (
										<Stack className="comments-box" key={commentData?._id}>
											<Stack className="main-comment">
												<Stack className="member-info">
													<Stack
														className="name-date"
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
													>
														<img src={getCommentMemberImage(commentData?.memberData?.memberImage)} alt="" />
														<Stack className="name-date-column">
															<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
															<Typography className="date">
																<Moment className={'time-added'} format={'DD.MM.YY HH:mm'}>
																	{commentData?.createdAt}
																</Moment>
															</Typography>
														</Stack>
													</Stack>
													{commentData?.memberId === user?._id && (
														<Stack className="buttons">
															<IconButton
																onClick={() => {
																	setUpdatedCommentId(commentData?._id);
																	updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																}}
															>
																<DeleteForeverIcon sx={{ color: '#757575', cursor: 'pointer' }} />
															</IconButton>
															<IconButton
																onClick={(e) => {
																	setUpdatedComment(commentData?.commentContent);
																	setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																	setUpdatedCommentId(commentData?._id);
																	setOpenBackdrop(true);
																}}
															>
																<EditIcon sx={{ color: '#757575' }} />
															</IconButton>
															<Backdrop
																sx={{
																	top: '40%',
																	right: '25%',
																	left: '25%',
																	width: '1000px',
																	height: 'fit-content',
																	borderRadius: '10px',
																	color: '#ffffff',
																	zIndex: 999,
																}}
																open={openBackdrop}
															>
																<Stack
																	sx={{
																		width: '100%',
																		height: '100%',
																		background: 'white',
																		border: '1px solid #b9b9b9',
																		padding: '15px',
																		gap: '10px',
																		borderRadius: '10px',
																		boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
																	}}
																>
																	<Typography variant="h4" color={'#b9b9b9'}>
																		Update comment
																	</Typography>
																	<Stack gap={'20px'}>
																		<input
																			autoFocus
																			value={updatedComment}
																			onChange={(e) => updateCommentInputHandler(e.target.value)}
																			type="text"
																			style={{
																				border: '1px solid #b9b9b9',
																				outline: 'none',
																				height: '40px',
																				padding: '0px 10px',
																				borderRadius: '5px',
																			}}
																		/>
																		<Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
																			<Typography variant="subtitle1" color={'#b9b9b9'}>
																				{updatedCommentWordsCnt}/100
																			</Typography>
																			<Stack sx={{ flexDirection: 'row', alignSelf: 'flex-end', gap: '10px' }}>
																				<Button
																					variant="outlined"
																					color="inherit"
																					onClick={() => cancelButtonHandler()}
																				>
																					Cancel
																				</Button>
																				<Button
																					variant="contained"
																					color="inherit"
																					onClick={() => updateButtonHandler(updatedCommentId, undefined)}
																				>
																					Update
																				</Button>
																			</Stack>
																		</Stack>
																	</Stack>
																</Stack>
															</Backdrop>
														</Stack>
													)}
												</Stack>
												<Stack className="content">
													<Typography>{commentData?.commentContent}</Typography>
												</Stack>
											</Stack>
										</Stack>
									);
								})}
								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
							</div>
						</div>
						<Stack className="right-config">
							<Stack className={'blog-name'}>
								<Typography className={'name'}>Categories</Typography>
							</Stack>

							<Tabs
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
							>
								<Tab
									value={'REVIEWS'}
									label={'Car Reviews'}
									className={`tab-button ${articleCategory == 'REVIEWS' ? 'active' : ''}`}
								/>
								<Tab
									value={'REPAIR'}
									label={'Repair & DIY'}
									className={`tab-button ${articleCategory == 'REPAIR' ? 'active' : ''}`}
								/>
								<Tab
									value={'PARTS'}
									label={'Parts Guide'}
									className={`tab-button ${articleCategory == 'PARTS' ? 'active' : ''}`}
								/>
								<Tab
									value={'NEWS'}
									label={'Auto News'}
									className={`tab-button ${articleCategory == 'NEWS' ? 'active' : ''}`}
								/>
								<Tab
									value={'COMMUNITY'}
									label={'Community'}
									className={`tab-button ${articleCategory == 'COMMUNITY' ? 'active' : ''}`}
								/>
							</Tabs>
							<Stack className="recent-articles">
								<Typography className="recent-title-heading">Recent Posts</Typography>
								<Stack className="recent-posts-list">
									{recentPosts.map((post) => (
										<RecentPostCard
											key={post.id}
											image={post.image}
											category={post.category}
											title={post.title}
											articleId={post.id}
										/>
									))}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
