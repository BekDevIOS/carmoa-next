import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentsInquiry, CommentInput } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import dynamic from 'next/dynamic';
import { CommentStatus, CommentGroup } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/blog/board-article';
import RecentPostCard from '../../libs/components/blog/RecentPostCard';
import { GET_BOARD_ARTICLE, GET_BOARD_ARTICLES, GET_COMMENTS } from '../../apollo/user/query';
import { LIKE_TARGET_BOARD_ARTICLE, CREATE_COMMENT, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { Messages, REACT_APP_API_URL, getMemberImageUrl } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Direction } from '../../libs/enums/common.enum';
import { BoardArticleCategory } from '../../libs/enums/blog.enum';
const ToastViewerComponent = dynamic(() => import('../../libs/components/blog/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const BlogDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = (query?.articleCategory as string) || BoardArticleCategory.REVIEWS;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
		search: {
			commentRefId: articleId || '',
		},
	});
	const [memberImage, setMemberImage] = useState<string>('/img/logo/logoText.svg');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle | null>(null);
	const [recentPosts, setRecentPosts] = useState<BoardArticle[]>([]);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.ARTICLE,
		commentContent: '',
		commentRefId: articleId || '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	// Fetch board article
	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		error: boardArticleError,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: articleId,
		},
		skip: !articleId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getBoardArticle) {
				setBoardArticle(data.getBoardArticle);
				setMemberImage(getMemberImageUrl(data.getBoardArticle.memberData?.memberImage, '/img/logo/logoText.svg'));
			}
		},
		onError: (error) => {
			console.error('Error fetching board article:', error);
		},
	});

	// Fetch comments
	const {
		loading: commentsLoading,
		data: commentsData,
		error: commentsError,
		refetch: commentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFilter,
		},
		skip: !searchFilter.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments) {
				setComments(data.getComments.list || []);
				setTotal(data.getComments.metaCounter[0]?.total || 0);
			}
		},
		onError: (error) => {
			console.error('Error fetching comments:', error);
		},
	});

	// Fetch recent posts - use articleCategory from URL or from fetched article
	const { loading: recentPostsLoading, data: recentPostsData } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {},
			},
		},
		skip: !articleCategory && !boardArticle?.articleCategory,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getBoardArticles) {
				// Filter out current article from recent posts
				const filteredPosts = (data.getBoardArticles.list || []).filter((post: BoardArticle) => post._id !== articleId);
				setRecentPosts(filteredPosts);
			}
		},
		onError: (error) => {
			console.error('Error fetching recent posts:', error);
		},
	});

	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) {
			setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
			setInsertCommentData({
				...insertCommentData,
				commentRefId: articleId,
			});
		}
	}, [articleId]);

	// Update URL with articleCategory when article is loaded
	useEffect(() => {
		if (boardArticle?.articleCategory && !query?.articleCategory) {
			router.replace(
				{
					pathname: '/blog/detail',
					query: { articleCategory: boardArticle.articleCategory, id: articleId },
				},
				undefined,
				{ shallow: true },
			);
		}
	}, [boardArticle?.articleCategory, articleId, query?.articleCategory, router]);

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

	const creteCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!comment.trim()) throw new Error(Messages.error4);

			await createComment({
				variables: {
					input: {
						...insertCommentData,
						commentContent: comment,
					},
				},
			});

			setComment('');
			setWordsCnt(0);
			await commentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('Comment added successfully!', 800);
		} catch (err: any) {
			console.error('ERROR, creteCommentHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);

			const updateData: CommentUpdate = {
				_id: commentId,
			};

			if (commentStatus === CommentStatus.DELETE) {
				updateData.commentStatus = CommentStatus.DELETE;
			} else if (updatedComment.trim()) {
				updateData.commentContent = updatedComment;
			} else {
				throw new Error(Messages.error4);
			}

			await updateComment({
				variables: {
					input: updateData,
				},
			});

			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
			await commentsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert(
				commentStatus === CommentStatus.DELETE ? 'Comment deleted successfully!' : 'Comment updated successfully!',
				800,
			);
		} catch (err: any) {
			console.error('ERROR, updateButtonHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		return getMemberImageUrl(imageUrl, '/img/logo/logoText.svg');
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
		const updatedFilter = { ...searchFilter, page: value };
		setSearchFilter(updatedFilter);
	};

	const likeArticleHandler = async () => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!articleId) return;

			setLikeLoading(true);
			await likeTargetBoardArticle({
				variables: {
					input: articleId,
				},
			});

			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.error('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	if (boardArticleLoading) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
				<Typography>Loading...</Typography>
			</Stack>
		);
	}

	if (!boardArticle) {
		return (
			<Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
				<Typography>Article not found</Typography>
			</Stack>
		);
	}

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
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon />
												) : (
													<ThumbUpOffAltIcon />
												)}

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
											<Button onClick={likeArticleHandler} disabled={likeLoading}>
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon />
												) : (
													<ThumbUpOffAltIcon />
												)}
												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>
								<Stack
									className="second-box-config"
									sx={{
										borderBottom: total > 0 ? 'none' : '1px solid var(--carmo-border)',
										border: '1px solid var(--carmo-border)',
										color: 'var(--carmo-text)',
									}}
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
											style={{
												color: 'var(--carmo-text)',
												backgroundColor: 'var(--carmo-bg-soft)',
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
									{recentPosts.length > 0 ? (
										recentPosts.map((post: BoardArticle) => {
											const imagePath: string = post?.articleImage
												? `${REACT_APP_API_URL}/${post?.articleImage}`
												: '/img/community/communityImg.png';
											return (
												<RecentPostCard
													key={post._id}
													image={imagePath}
													category={post.articleCategory}
													title={post.articleTitle}
													articleId={post._id}
													articleCategory={post.articleCategory}
												/>
											);
										})
									) : (
										<Stack className={'no-data'}>
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No recent posts</p>
										</Stack>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};
BlogDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(BlogDetail);
