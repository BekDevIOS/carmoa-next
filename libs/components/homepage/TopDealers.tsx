import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import DealerCard from '../common/DealerCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Dealer {
	id: number;
	name: string;
	type: string;
	image: string;
}

const TopDealers = () => {
	const device = useDeviceDetect();

	// Hardcoded dealers data
	const dealers: Dealer[] = [
		{
			id: 1,
			name: 'Sarah Johnson',
			type: 'Premium Dealer',
			image: '/img/profile/girl.svg',
		},
		{
			id: 2,
			name: 'Emily Davis',
			type: 'Elite Dealer',
			image: '/img/profile/girl.svg',
		},
		{
			id: 3,
			name: 'Jessica Martinez',
			type: 'Premium Dealer',
			image: '/img/profile/girl.svg',
		},
		{
			id: 4,
			name: 'Amanda Wilson',
			type: 'Elite Dealer',
			image: '/img/profile/girl.svg',
		},
		{
			id: 5,
			name: 'Michelle Brown',
			type: 'Premium Dealer',
			image: '/img/profile/girl.svg',
		},
		{
			id: 6,
			name: 'Rachel Taylor',
			type: 'Elite Dealer',
			image: '/img/profile/girl.svg',
		},
		{
			id: 7,
			name: 'Nicole Anderson',
			type: 'Premium Dealer',
			image: '/img/profile/girl.svg',
		},
		{
			id: 8,
			name: 'Lauren Thomas',
			type: 'Elite Dealer',
			image: '/img/profile/girl.svg',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack className={'top-dealers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>
							<span className={'title-highlight'}>TOP</span> DEALERS
						</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-dealers-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{dealers.map((dealer: Dealer) => {
								return (
									<SwiperSlide className={'top-dealers-slide'} key={dealer.id}>
										<DealerCard dealer={dealer} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-dealers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>
								<span className={'title-highlight'}>TOP</span> DEALERS
							</span>
							<p>Our Top Dealers always ready to serve you</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>See All Dealers</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-dealers-prev'}>
							<ArrowBackIosNewIcon />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-dealers-swiper'}
								slidesPerView={'auto'}
								spaceBetween={29}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-dealers-next',
									prevEl: '.swiper-dealers-prev',
								}}
							>
								{dealers.map((dealer: Dealer) => {
									return (
										<SwiperSlide className={'top-dealers-slide'} key={dealer.id}>
											<DealerCard dealer={dealer} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box component={'div'} className={'switch-btn swiper-dealers-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default TopDealers;

