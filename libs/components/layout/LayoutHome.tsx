import React, { useEffect, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Footer from '../Footer';
import { Stack, Box } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import TopHeader from '../TopHeader';
import MainHeader from '../MainHeader';
import FeatureCard from '../FeatureCard';
import HeroBannerOverlay from '../homepage/HeroBannerOverlay';
import CompareFab from '../compare/CompareFab';
import CompareModal from '../compare/CompareModal';
import { CompareProduct } from '../../../apollo/store';
import { getJwtToken, updateUserInfo } from '../../auth';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const [compareModalOpen, setCompareModalOpen] = useState(false);

		const handleAddToCart = (product: CompareProduct) => {
			// TODO: Implement actual cart functionality
			// This should add the product to the cart state/drawer
			console.log('Add to cart from compare:', product);
			// You can integrate with your cart state management here
		};

		// Features data
		const features = [
			{
				icon: LocalShippingOutlinedIcon,
				title: 'Free Shipping',
				description: 'Free shipping for orders over $99',
			},
			{
				icon: VerifiedUserOutlinedIcon,
				title: 'Money Guarantee',
				description: 'Within 30 days for an exchange',
			},
			{
				icon: HeadsetMicIcon,
				title: 'Online Support',
				description: '24 hours a day, 7 days a week',
			},
			{
				icon: CreditCardOutlinedIcon,
				title: 'Flexible Payment',
				description: 'Pay with Multiple Credit Cards',
			},
		];

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);
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
						<CompareFab onClick={() => setCompareModalOpen(true)} />
						<CompareModal
							open={compareModalOpen}
							onClose={() => setCompareModalOpen(false)}
							onAddToCart={handleAddToCart}
						/>
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
							<HeroBannerOverlay />
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
						<CompareFab onClick={() => setCompareModalOpen(true)} />
						<CompareModal
							open={compareModalOpen}
							onClose={() => setCompareModalOpen(false)}
							onAddToCart={handleAddToCart}
						/>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
