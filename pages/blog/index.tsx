import React, { useEffect, useState } from 'react';
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

// export const getStaticProps = async ({ locale }: any) => ({
// 	props: {
// 		...(await serverSideTranslations(locale, ['common'])),
// 	},
// });

const Blog: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchBlog, setSearchBlog] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([
		{
			_id: '1',
			articleCategory: BoardArticleCategory.REVIEWS,
			articleStatus: 'ACTIVE' as any,
			articleTitle: '2024 Toyota Camry Review: The Perfect Family Sedan',
			articleContent:
				'The 2024 Toyota Camry continues to set the standard for midsize sedans with its refined ride, spacious interior, and excellent fuel economy. With a perfect blend of comfort and technology, this vehicle offers exceptional value for families looking for a reliable daily driver. The hybrid variant delivers an impressive 52 MPG combined, making it one of the most fuel-efficient options in its class.',
			articleImage: '/img/banner/cities/BUSAN.webp',
			articleViews: 1250,
			articleLikes: 89,
			articleComments: 23,
			memberId: 'member1',
			createdAt: new Date('2024-11-15'),
			updatedAt: new Date('2024-11-15'),
			memberData: {
				_id: 'member1',
				memberNick: 'CarEnthusiast',
				memberImage: '/img/logo/logoText.svg',
			} as any,
		},
		{
			_id: '2',
			articleCategory: BoardArticleCategory.REVIEWS,
			articleStatus: 'ACTIVE' as any,
			articleTitle: 'Tesla Model 3 Long Range: Electric Performance Redefined',
			articleContent:
				'The Tesla Model 3 Long Range offers an incredible driving experience with its instant torque, cutting-edge autopilot features, and impressive 358-mile range. This electric sedan combines performance with practicality, featuring a minimalist interior dominated by a large touchscreen. The build quality has improved significantly, and the charging network makes long-distance travel surprisingly convenient.',
			articleImage: '/img/banner/cities/BUSAN.webp',
			articleViews: 2340,
			articleLikes: 156,
			articleComments: 45,
			memberId: 'member2',
			createdAt: new Date('2024-11-14'),
			updatedAt: new Date('2024-11-14'),
			memberData: {
				_id: 'member2',
				memberNick: 'EVExpert',
				memberImage: '/img/logo/logoText.svg',
			} as any,
		},
		{
			_id: '3',
			articleCategory: BoardArticleCategory.REVIEWS,
			articleStatus: 'ACTIVE' as any,
			articleTitle: 'Honda CR-V 2024: The Ultimate Compact SUV',
			articleContent:
				'Honda has outdone itself with the 2024 CR-V, offering a spacious cabin, advanced safety features, and a smooth hybrid powertrain. This compact SUV excels in practicality with its versatile cargo space and comfortable seating for five. The infotainment system is intuitive, and the ride quality strikes an excellent balance between comfort and handling. Perfect for growing families who need reliable transportation.',
			articleImage: '/img/banner/cities/BUSAN.webp',
			articleViews: 1890,
			articleLikes: 134,
			articleComments: 38,
			memberId: 'member3',
			createdAt: new Date('2024-11-13'),
			updatedAt: new Date('2024-11-13'),
			memberData: {
				_id: 'member3',
				memberNick: 'SUVReviewer',
				memberImage: '/img/logo/logoText.svg',
			} as any,
		},
	]);
	const [totalCount, setTotalCount] = useState<number>(3);
	
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
			title: 'Sed et quam quis sdfsdf sdfdsf sdfdsf sdfsd ',
		},
		{
			id: '6',
			image: '/img/banner/cities/BUSAN.webp',
			category: 'BLOG',
			title: 'Sed mattis est libero',
		},
		{
			id: '6',
			image: '/img/banner/cities/BUSAN.webp',
			category: 'BLOG',
			title: 'Sed mattis ',
		},
	];
	
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'REVIEWS' },
				},
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		console.log(value);

		setSearchBlog({ ...searchBlog, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{
				pathname: '/blog',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchBlog({ ...searchBlog, page: value });
	};

	if (device === 'mobile') {
		return <h1>BLOG PAGE MOBILE</h1>;
	} else {
		return (
			<div id="blog-list-page">
				<div className="container">
					<TabContext value={searchBlog.search.articleCategory || 'REVIEWS'}>
						<Stack className="main-box">
							<Stack className="left-config">
								<Stack className="panel-config">
									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">
												{searchBlog.search.articleCategory === 'REVIEWS' && 'CAR REVIEWS'}
												{searchBlog.search.articleCategory === 'REPAIR' && 'REPAIR & DIY'}
												{searchBlog.search.articleCategory === 'PARTS' && 'PARTS GUIDE'}
												{searchBlog.search.articleCategory === 'NEWS' && 'AUTO NEWS'}
												{searchBlog.search.articleCategory === 'COMMUNITY' && 'COMMUNITY'}
											</Typography>
											<Typography className="sub-title">
												{searchBlog.search.articleCategory === 'REVIEWS' &&
													'Expert reviews and comparisons of the latest vehicles'}
												{searchBlog.search.articleCategory === 'REPAIR' &&
													'DIY guides and repair tips for car maintenance'}
												{searchBlog.search.articleCategory === 'PARTS' &&
													'Comprehensive guides for choosing the right car parts'}
												{searchBlog.search.articleCategory === 'NEWS' &&
													'Latest news and updates from the automotive industry'}
												{searchBlog.search.articleCategory === 'COMMUNITY' &&
													'Share your experiences and connect with other car enthusiasts'}
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

									<TabPanel value="REVIEWS">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return <BlogCard boardArticle={boardArticle} key={boardArticle?._id} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="REPAIR">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return <BlogCard boardArticle={boardArticle} key={boardArticle?._id} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="PARTS">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return <BlogCard boardArticle={boardArticle} key={boardArticle?._id} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="NEWS">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return <BlogCard boardArticle={boardArticle} key={boardArticle?._id} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="COMMUNITY">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return <BlogCard boardArticle={boardArticle} key={boardArticle?._id} />;
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No Article found!</p>
												</Stack>
											)}
										</Stack>
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
										className={`tab-button ${searchBlog.search.articleCategory == 'REVIEWS' ? 'active' : ''}`}
									/>
									<Tab
										value={'REPAIR'}
										label={'Repair & DIY'}
										className={`tab-button ${searchBlog.search.articleCategory == 'REPAIR' ? 'active' : ''}`}
									/>
									<Tab
										value={'PARTS'}
										label={'Parts Guide'}
										className={`tab-button ${searchBlog.search.articleCategory == 'PARTS' ? 'active' : ''}`}
									/>
									<Tab
										value={'NEWS'}
										label={'Auto News'}
										className={`tab-button ${searchBlog.search.articleCategory == 'NEWS' ? 'active' : ''}`}
									/>
									<Tab
										value={'COMMUNITY'}
										label={'Community'}
										className={`tab-button ${searchBlog.search.articleCategory == 'COMMUNITY' ? 'active' : ''}`}
									/>
							</TabList>
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

					{totalCount > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(totalCount / searchBlog.limit)}
									page={searchBlog.page}
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
