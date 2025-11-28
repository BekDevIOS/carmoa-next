import React, { useEffect, useState, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import BlogCard from '../../libs/components/common/BlogCard';
import RecentPostCard from '../../libs/components/blog/RecentPostCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/blog/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/blog/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/blog.enum';
import { Direction } from '../../libs/enums/common.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Helper constants for category titles and subtitles
const CATEGORY_INFO: Record<BoardArticleCategory, { title: string; subtitle: string }> = {
	[BoardArticleCategory.REVIEWS]: {
		title: 'CAR REVIEWS',
		subtitle: 'Expert reviews and comparisons of the latest vehicles',
	},
	[BoardArticleCategory.REPAIR]: {
		title: 'REPAIR & DIY',
		subtitle: 'DIY guides and repair tips for car maintenance',
	},
	[BoardArticleCategory.PARTS]: {
		title: 'PARTS GUIDE',
		subtitle: 'Comprehensive guides for choosing the right car parts',
	},
	[BoardArticleCategory.NEWS]: {
		title: 'AUTO NEWS',
		subtitle: 'Latest news and updates from the automotive industry',
	},
	[BoardArticleCategory.COMMUNITY]: {
		title: 'COMMUNITY',
		subtitle: 'Share your experiences and connect with other car enthusiasts',
	},
};

const Blog: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = (query?.articleCategory as string) || BoardArticleCategory.REVIEWS;

	// Initialize state properly without mutating props
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(() => ({
		...initialInput,
		search: {
			...initialInput.search,
			articleCategory: (articleCategory as BoardArticleCategory) || initialInput.search.articleCategory,
		},
	}));
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [recentPosts, setRecentPosts] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: getBoardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchCommunity,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list || []);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total || 0);
		},
		onError: (error) => {
			console.error('Error fetching board articles:', error);
		},
	});

	// Fetch recent posts dynamically
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
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecentPosts(data?.getBoardArticles?.list || []);
		},
		onError: (error) => {
			console.error('Error fetching recent posts:', error);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory) {
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: BoardArticleCategory.REVIEWS },
				},
				router.pathname,
				{ shallow: true },
			);
		}
	}, [query?.articleCategory, router]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		const category = value as BoardArticleCategory;
		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: category } });
		await router.push(
			{
				pathname: '/blog',
				query: { articleCategory: category },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: React.SyntheticEvent, user: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user?._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.error('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// Memoize category info to avoid recalculation
	const categoryInfo = useMemo(() => {
		const category = searchCommunity.search.articleCategory || BoardArticleCategory.REVIEWS;
		return CATEGORY_INFO[category] || CATEGORY_INFO[BoardArticleCategory.REVIEWS];
	}, [searchCommunity.search.articleCategory]);

	// Render article list component to avoid duplication
	const renderArticleList = () => {
		if (totalCount > 0 && boardArticles.length > 0) {
			return boardArticles.map((boardArticle: BoardArticle) => (
				<BlogCard boardArticle={boardArticle} key={boardArticle?._id} likeArticleHandler={likeArticleHandler} />
			));
		}
		return (
			<Stack className={'no-data'}>
				<img src="/img/icons/icoAlert.svg" alt="" />
				<p>No Article found!</p>
			</Stack>
		);
	};

	if (device === 'mobile') {
		return <h1>BLOG PAGE MOBILE</h1>;
	} else {
		return (
			<div id="blog-list-page">
				<div className="container">
					<TabContext value={searchCommunity.search.articleCategory || 'REVIEWS'}>
						<Stack className="main-box">
							<Stack className="left-config">
								<Stack className="panel-config">
									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">{categoryInfo.title}</Typography>
											<Typography className="sub-title">{categoryInfo.subtitle}</Typography>
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

									<TabPanel value={BoardArticleCategory.REVIEWS}>
										<Stack className="list-box">{renderArticleList()}</Stack>
									</TabPanel>
									<TabPanel value={BoardArticleCategory.REPAIR}>
										<Stack className="list-box">{renderArticleList()}</Stack>
									</TabPanel>
									<TabPanel value={BoardArticleCategory.PARTS}>
										<Stack className="list-box">{renderArticleList()}</Stack>
									</TabPanel>
									<TabPanel value={BoardArticleCategory.NEWS}>
										<Stack className="list-box">{renderArticleList()}</Stack>
									</TabPanel>
									<TabPanel value={BoardArticleCategory.COMMUNITY}>
										<Stack className="list-box">{renderArticleList()}</Stack>
									</TabPanel>
								</Stack>
							</Stack>
							<Stack className="right-config">
								<Stack className={'blog-name'}>
									<Typography className={'name'}>Categories</Typography>
								</Stack>

								<TabList
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
										className={`tab-button ${searchCommunity.search.articleCategory == 'REVIEWS' ? 'active' : ''}`}
									/>
									<Tab
										value={'REPAIR'}
										label={'Repair & DIY'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'REPAIR' ? 'active' : ''}`}
									/>
									<Tab
										value={'PARTS'}
										label={'Parts Guide'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'PARTS' ? 'active' : ''}`}
									/>
									<Tab
										value={'NEWS'}
										label={'Auto News'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'NEWS' ? 'active' : ''}`}
									/>
									<Tab
										value={'COMMUNITY'}
										label={'Community'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'COMMUNITY' ? 'active' : ''}`}
									/>
								</TabList>
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

						{totalCount > 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(totalCount / searchCommunity.limit)}
										page={searchCommunity.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>
										Total {totalCount} article{totalCount > 1 ? 's' : ''} available
									</Typography>
								</Stack>
							</Stack>
						)}
					</TabContext>
				</div>
			</div>
		);
	}
};

Blog.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'REVIEWS',
		},
	},
};

export default withLayoutBasic(Blog);
