import React, { useRef } from 'react';
import { Box, Typography, Button, Stack, Avatar, Paper, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import 'swiper/css';
import 'swiper/css/navigation';

const HeroBannerOverlay = () => {
	const swiperRef = useRef<any>(null);

	const categoryCards = [
		{
			id: 1,
			title: 'Headlights',
			subtitle: '2,500+ items',
			image: '/img/product/image2.png',
			price: '$1,500',
		},
		{
			id: 2,
			title: 'Brake Pads',
			subtitle: '1,800+ items',
			image: '/img/product/image2.png',
		},
		{
			id: 3,
			title: 'Engine Parts',
			subtitle: '3,200+ items',
			image: '/img/product/image2.png',
		},
	];

	return (
			<Box className="hero-banner-overlay">
				<Box className="overlay-wrapper">
					{/* Left Column - Static Content */}
					<Box className="left-column">
						{/* Badge */}
						<Box className="badge">
							<StorefrontIcon className="badge-icon" />
							<Typography variant="body2" className="badge-text">
								The Best Online Auto Parts Store
							</Typography>
						</Box>

						{/* Main Heading */}
						<Typography variant="h2" className="main-heading">
            Premium Auto Parts for Every Car
						</Typography>

						{/* Sub Text */}
						<Typography variant="body1" className="sub-text">
            Discover high-quality auto parts from trusted brands.
            Fast delivery, competitive prices, and reliable service.
						</Typography>

						{/* Buttons Row */}
						<Stack direction="row" spacing={2} className="buttons-row">
							<Button variant="contained" color="primary" className="shop-now-btn" endIcon={<ArrowForwardIcon />}>
								Shop Now
							</Button>
							<Button variant="text" className="view-all-btn">
								View All Products
							</Button>
						</Stack>

						{/* Rating Row */}
						<Stack direction="row" spacing={1} alignItems="center" className="rating-row">
							<Avatar className="rating-avatar rating-avatar-first" src="/img/profile/girl.svg" alt="Customer" />
							<Avatar className="rating-avatar" src="/img/profile/girl.svg" alt="Customer" />
							<Avatar className="rating-avatar" src="/img/profile/girl.svg" alt="Customer" />
							<Avatar className="rating-avatar" src="/img/profile/girl.svg" alt="Customer" />
							<Box className="rating-plus-badge">
								<AddIcon className="rating-plus-icon" />
							</Box>
							<Stack direction="column" spacing={0.5} className="rating-text">
								<Typography variant="h6" className="rating-title">
									4.9 Ratings+
								</Typography>
								<Typography variant="caption" className="rating-subtitle">
									Trusted by 50k+ Customers
								</Typography>
							</Stack>
						</Stack>
					</Box>

					{/* Right Column - Swiper */}
					<Box className="right-column">
						<Swiper
							modules={[Navigation]}
							slidesPerView={2}
							spaceBetween={20}
							grabCursor={true}
							navigation={{
								nextEl: '.swiper-category-next',
								prevEl: '.swiper-category-prev',
							}}
							onSwiper={(swiper) => {
								swiperRef.current = swiper;
							}}
							className="category-swiper"
						>
							{categoryCards.map((card) => (
								<SwiperSlide key={card.id}>
									<Paper elevation={3} className="category-card">
										<Box className="card-image-wrapper">
											<img src={card.image} alt={card.title} className="card-image" />
											{/* {card.price && (
												<Box className="card-price-overlay">
													<Typography variant="body2" className="card-price-text">
														{card.price}
													</Typography>
												</Box>
											)} */}
										</Box>
										<Box className="card-content">
											<Typography variant="h6" className="card-title">
												{card.title}
											</Typography>
											<Typography variant="body2" className="card-subtitle">
												{card.subtitle}
											</Typography>
										</Box>
										<IconButton className="card-action-btn">
											<ArrowOutwardIcon />
										</IconButton>
									</Paper>
								</SwiperSlide>
							))}
						</Swiper>
						{/* Navigation Arrows */}
						<Stack direction="row" spacing={1} justifyContent="center" className="swiper-nav-buttons">
							<Box
								className="swiper-nav-btn swiper-nav-prev swiper-category-prev"
								onClick={() => swiperRef.current?.slidePrev()}
							>
								<ArrowBackIosNewIcon className="nav-icon" />
							</Box>
							<Box
								className="swiper-nav-btn swiper-nav-next swiper-category-next"
								onClick={() => swiperRef.current?.slideNext()}
							>
								<ArrowBackIosNewIcon className="nav-icon" />
							</Box>
						</Stack>
					</Box>
				</Box>
			</Box>
	);
};

export default HeroBannerOverlay;
