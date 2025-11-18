import React, { useRef } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LatestBlogCard from './LatestBlogCard';
import 'swiper/css';
import 'swiper/css/navigation';

interface BlogPost {
	id: number;
	image: string;
	date: string;
	day: string;
	month: string;
	title: string;
	description: string;
}

const LatestBlogs = () => {
	const swiperRef = useRef<any>(null);

	const blogs: BlogPost[] = [
		{
			id: 1,
			image: '/img/community/communityImg.png',
			date: '2024-10-03',
			day: '03',
			month: 'Oct',
			title: 'Duis aute irure dolor in',
			description:
				'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		},
		{
			id: 2,
			image: '/img/community/communityImg.png',
			date: '2024-10-03',
			day: '03',
			month: 'Oct',
			title: 'Sunt in culpa qui officia deserunt',
			description:
				'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		},
		{
			id: 3,
			image: '/img/community/communityImg.png',
			date: '2024-10-03',
			day: '03',
			month: 'Oct',
			title: 'Excepteur sint occaecat cup',
			description:
				'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		},
		{
			id: 4,
			image: '/img/community/communityImg.png',
			date: '2024-10-03',
			day: '03',
			month: 'Oct',
			title: 'Duis aute irure dolor in',
			description:
				'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		},
		{
			id: 5,
			image: '/img/community/communityImg.png',
			date: '2024-10-03',
			day: '03',
			month: 'Oct',
			title: 'Sunt in culpa qui officia deserunt',
			description:
				'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		},
		{
			id: 6,
			image: '/img/community/communityImg.png',
			date: '2024-10-03',
			day: '03',
			month: 'Oct',
			title: 'Excepteur sint occaecat cup',
			description:
				'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
		},
	];

	const readMoreHandler = (blogId: number) => {
		console.log('Read more:', blogId);
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
							slidesPerView={3}
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
							{blogs.map((blog) => (
								<SwiperSlide key={blog.id} className={'latest-blog-slide'}>
									<LatestBlogCard blog={blog} readMoreHandler={readMoreHandler} />
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

export default LatestBlogs;

