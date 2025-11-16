import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper';
import { Box } from '@mui/material';

const HeroSlider = () => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const swiperRef = useRef<any>(null);

	const slides = [
		{
			id: 1,
			image: '/img/banner/header.webp',
		},
		{
			id: 2,
			image: '/img/banner/header.webp',
		},
		{
			id: 3,
			image: '/img/banner/header.webp',
		},
	];

	useEffect(() => {
		let cleanup: (() => void) | undefined;

		// Wait for Swiper to render pagination
		const timer = setTimeout(() => {
			const bullets = document.querySelectorAll('.swiper-pagination-bullet');
			const handlers: Array<{ bullet: Element; enter: () => void; leave: () => void }> = [];

			bullets.forEach((bullet, index) => {
				const enterHandler = () => {
					setHoveredIndex(index);
				};
				const leaveHandler = () => {
					setHoveredIndex(null);
				};

				bullet.addEventListener('mouseenter', enterHandler);
				bullet.addEventListener('mouseleave', leaveHandler);

				handlers.push({ bullet, enter: enterHandler, leave: leaveHandler });
			});

			cleanup = () => {
				handlers.forEach(({ bullet, enter, leave }) => {
					bullet.removeEventListener('mouseenter', enter);
					bullet.removeEventListener('mouseleave', leave);
				});
			};
		}, 100);

		return () => {
			clearTimeout(timer);
			if (cleanup) {
				cleanup();
			}
		};
	}, []);

	return (
		<Box component={'div'} className={'hero-slider'}>
			<Swiper
				modules={[Pagination, Autoplay]}
				spaceBetween={0}
				slidesPerView={1}
				loop={true}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				pagination={{
					clickable: true,
					bulletClass: 'swiper-pagination-bullet',
					bulletActiveClass: 'swiper-pagination-bullet-active',
				}}
				onSwiper={(swiper) => {
					swiperRef.current = swiper;
				}}
				className={'hero-swiper'}
			>
				{slides.map((slide) => (
					<SwiperSlide key={slide.id} className={'hero-slide'}>
						<Box component={'div'} className={'slide-image-wrapper'}>
							<img src={slide.image} alt={`Hero slide ${slide.id}`} className={'slide-image'} />
						</Box>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Preview Image on Hover */}
			{hoveredIndex !== null && (
				<Box component={'div'} className={'pagination-preview'}>
					<img src={slides[hoveredIndex].image} alt={`Preview slide ${hoveredIndex + 1}`} className={'preview-image'} />
				</Box>
			)}
		</Box>
	);
};

export default HeroSlider;

