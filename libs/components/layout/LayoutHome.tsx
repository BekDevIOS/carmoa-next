import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Footer from '../Footer';
import { Stack, Box } from '@mui/material';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import TopHeader from '../TopHeader';
import MainHeader from '../MainHeader';
import FeatureCard from '../FeatureCard';
import dynamic from 'next/dynamic';

const HeroSlider = dynamic(() => import('../homepage/HeroSlider'), {
	ssr: false,
});

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();

		// Features data
		const features = [
			{
				icon: '/img/icons/home.svg',
				title: 'Free Shipping',
				description: 'Free shipping for orders over $99',
			},
			{
				icon: '/img/icons/securePayment.svg',
				title: 'Money Guarantee',
				description: 'Within 30 days for an exchange',
			},
			{
				icon: '/img/icons/call.svg',
				title: 'Online Support',
				description: '24 hours a day, 7 days a week',
			},
			{
				icon: '/img/icons/security.svg',
				title: 'Flexible Payment',
				description: 'Pay with Multiple Credit Cards',
			},
		];

		/** LIFECYCLES **/

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>CarMoa</title>
						<meta name={'title'} content={`CarMoa`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}></Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>CarMoa</title>
						<meta name={'title'} content={`CarMoa`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'} className="navbar">
							<TopHeader />
							<MainHeader />
						</Stack>
						<Stack className={'header-main'}>
							<HeroSlider />
						</Stack>
					<Stack id={'main'}>
						<Component {...props} />
					</Stack>
					<Stack className="layout-features-section">
						<div className="container">
							<Stack className="features-grid">
								{features.map((feature, index) => (
									<FeatureCard
										key={index}
										icon={feature.icon}
										title={feature.title}
										description={feature.description}
									/>
								))}
							</Stack>
						</div>
					</Stack>
					<Stack id={'footer'}>
						<Footer />
					</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
