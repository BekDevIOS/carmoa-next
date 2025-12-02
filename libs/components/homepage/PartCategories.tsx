import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Stack } from '@mui/material';
import PartCategoryCard from './PartCategoryCard';
import 'swiper/css';

const PartCategories = () => {
	const categories = [
		{
			id: 1,
			image: '/img/category/electric2.webp',
			hoverImage: '/img/category/electric.webp',
			title: 'ELECTRICAL',
		},
		{
			id: 2,
			image: '/img/category/engine.webp',
			hoverImage: '/img/category/engine2.webp',
			title: 'ENGINE',
		},
		{
			id: 3,
			image: '/img/category/exterior.webp',
			hoverImage: '/img/category/exterior2.webp',
			title: 'EXTERIOR',
		},
		{
			id: 4,
			image: '/img/category/interior.webp',
			hoverImage: '/img/category/interior2.webp',
			title: 'INTERIOR',
		},
		{
			id: 5,
			image: '/img/category/suspen.webp',
			hoverImage: '/img/category/suspen2.webp',
			title: 'SUSPENSION',
		},
	];

	return (
		<Stack className={'part-categories'}>
			<Stack className={'container'}>
				<Swiper spaceBetween={15} slidesPerView={5} className={'categories-swiper'}>
					{categories.map((category) => (
						<SwiperSlide key={category.id} className={'category-slide'}>
							<PartCategoryCard image={category.image} hoverImage={category.hoverImage} title={category.title} />
						</SwiperSlide>
					))}
				</Swiper>
			</Stack>
		</Stack>
	);
};

export default PartCategories;
