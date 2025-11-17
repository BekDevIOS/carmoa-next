import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Stack } from '@mui/material';
import PartCategoryCard from './PartCategoryCard';
import 'swiper/css';

const PartCategories = () => {
	const categories = [
		{
			id: 1,
			image: '/img/category/headlight.png',
			hoverImage: '/img/category/headlight.png',
			title: 'LIGHTING',
		},
		{
			id: 2,
			image: '/img/category/headlight.png',
			hoverImage: '/img/category/headlight.png',
			title: 'BODY PARTS',
		},
		{
			id: 3,
			image: '/img/category/headlight.png',
			hoverImage: '/img/category/headlight.png',
			title: 'ELECTRONICS',
		},
		{
			id: 4,
			image: '/img/category/headlight.png',
			hoverImage: '/img/category/headlight.png',
			title: 'PERFORMANCE PARTS',
		},
		{
			id: 5,
			image: '/img/category/headlight.png',
			hoverImage: '/img/category/headlight.png',
			title: 'REPAIR PARTS',
		},
		{
			id: 6,
			image: '/img/category/headlight.png',
			hoverImage: '/img/category/headlight.png',
			title: 'WHEELS AND TIRES',
		},
		{
			id: 7,
			image: '/img/category/headlight.png',
			hoverImage: '/img/category/headlight.png',
			title: 'ENGINE PARTS',
		},
		{
			id: 8,
			image: '/img/category/headlight.png',
			hoverImage: '/img/category/headlight.png',
			title: 'INTERIOR PARTS',
		},
	];

	return (
		<Stack className={'part-categories'}>
			<Stack className={'container'}>
				<Swiper
					spaceBetween={15}
					slidesPerView={6}
					className={'categories-swiper'}
				>
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
