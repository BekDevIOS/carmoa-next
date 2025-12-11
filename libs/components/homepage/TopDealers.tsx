import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import DealerCard from '../common/DealerCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AgentsInquiry } from '../../types/member/member.input';
import { useRouter } from 'next/router';
import { Member } from '../../types/member/member';
import { useQuery } from '@apollo/client';
import { GET_AGENTS } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface TopDealerProps {
	initialInput: AgentsInquiry;
}

const TopDealers = (props: TopDealerProps) => {
	const { initialInput } = props;
	const { t } = useTranslation('common');
	const device = useDeviceDetect();
	const router = useRouter();
	const [topDealers, setTopDealers] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getDealersLoading,
		data: getDealersData,
		error: getDealersError,
		refetch: getDealersRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopDealers(data?.getAgents?.list);
		},
	});

	/** HANDLERS **/

	if (!topDealers) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'top-dealers mobile'}>
				<Stack className={'container'}>
					<Stack className={'section-header mobile'}>
						<Typography variant="h2" className={'main-title mobile'}>
							<span className={'title-highlight'}>{t('TOP')}</span> {t('DEALERS')}
						</Typography>
					</Stack>
					<Stack className={'wrapper mobile'}>
						<Swiper className={'top-dealers-swiper mobile'} slidesPerView={1} spaceBetween={16} centeredSlides={false}>
							{topDealers.map((dealer: Member) => {
								return (
									<SwiperSlide className={'top-dealers-slide mobile'} key={dealer._id}>
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
								<span className={'title-highlight'}>{t('TOP')}</span> {t('DEALERS')}
							</span>
							<p>{t('Our Top Dealers always ready to serve you')}</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>{t('See All Dealers')}</span>
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
								{topDealers.map((dealer: Member) => {
									return (
										<SwiperSlide className={'top-dealers-slide'} key={dealer._id}>
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

TopDealers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopDealers;
