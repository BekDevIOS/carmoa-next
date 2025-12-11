import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PartCategoryCard from './PartCategoryCard';
import 'swiper/css';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Autoplay } from 'swiper';

const PartCategories = () => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const device = useDeviceDetect();
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

	const handleCategoryClick = (categoryTitle: string) => {
		const searchParams = {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: 'DESC',
			search: {
				mainCategoryList: [categoryTitle],
			},
		};

		const queryString = `input=${JSON.stringify(searchParams)}`;
		router.push(`/product?${queryString}`);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'part-categories'}>
				<Stack className={'container'}>
					<Swiper
						className={'categories-swiper mobile'}
						slidesPerView={1.2}
						centeredSlides
						spaceBetween={16}
						modules={[Autoplay]}
						autoplay={{ delay: 2400, disableOnInteraction: false }}
					>
						{categories.map((category) => (
							<SwiperSlide key={category.id} className={'category-slide mobile-category-slide'}>
								<PartCategoryCard
									image={category.image}
									hoverImage={category.hoverImage}
									title={t(category.title)}
									onClick={() => handleCategoryClick(category.title)}
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</Stack>
			</Stack>
		);
	} else {
	return (
		<Stack className={'part-categories'}>
			<Stack className={'container'}>
				<Swiper spaceBetween={15} slidesPerView={5} className={'categories-swiper'}>
					{categories.map((category) => (
						<SwiperSlide key={category.id} className={'category-slide'}>
							<PartCategoryCard
								image={category.image}
								hoverImage={category.hoverImage}
								title={t(category.title)}
								onClick={() => handleCategoryClick(category.title)}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</Stack>
		</Stack>
		);
	}
};

export default PartCategories;
