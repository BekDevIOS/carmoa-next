import React, { useRef, useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BlogCard from '../common/BlogCard';
import { BoardArticle } from '../../types/blog/board-article';
import { BoardArticlesInquiry } from '../../types/blog/board-article.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { userVar } from '../../../apollo/store';
import 'swiper/css';
import 'swiper/css/navigation';

interface LatestBlogsProps {
	initialInput?: BoardArticlesInquiry;
}

const LatestBlogs = (props: LatestBlogsProps) => {
	const { initialInput } = props;
	const swiperRef = useRef<any>(null);
	const user = useReactiveVar(userVar);
	const [latestBlogs, setLatestBlogs] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: getBoardArticlesLoading,
		data: getBoardArticlesData,
		error: getBoardArticlesError,
		refetch: getBoardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setLatestBlogs(data?.getBoardArticles?.list || []);
		},
	});

	/** HANDLERS **/
	const likeArticleHandler = async (e: React.SyntheticEvent, user: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await getBoardArticlesRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('Success!', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<Stack className={'latest-blogs'}>
			<Stack className={'container'}>
				<Stack className={'section-header'}>
					<Stack className={'title-section'}>
						<Typography variant="h2" className={'main-title'}>
							<span className={'title-highlight'}>LATEST</span> BLOG
						</Typography>
						<Typography variant="body1" className={'subtitle'}>
							The latest blog of Autusin
						</Typography>
					</Stack>
				</Stack>
				<Stack className={'blogs-wrapper'}>
					<Box component={'div'} className={'switch-btn swiper-blogs-prev'}>
						<ArrowBackIosNewIcon />
					</Box>
					<Box component={'div'} className={'swiper-container'}>
						<Swiper
							className={'latest-blogs-swiper'}
							slidesPerView={4}
							spaceBetween={30}
							modules={[Navigation]}
							navigation={{
								nextEl: '.swiper-blogs-next',
								prevEl: '.swiper-blogs-prev',
							}}
							onSwiper={(swiper) => {
								swiperRef.current = swiper;
							}}
						>
							{latestBlogs.map((blog) => (
								<SwiperSlide key={blog._id} className={'latest-blog-slide'}>
									<BlogCard boardArticle={blog} likeArticleHandler={likeArticleHandler} />
								</SwiperSlide>
							))}
						</Swiper>
					</Box>
					<Box component={'div'} className={'switch-btn swiper-blogs-next'}>
						<ArrowBackIosNewIcon />
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

LatestBlogs.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default LatestBlogs;

