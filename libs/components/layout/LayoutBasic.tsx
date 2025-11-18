import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Footer from '../Footer';
import { Stack, Box, Typography } from '@mui/material';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import TopHeader from '../TopHeader';
import MainHeader from '../MainHeader';
import dynamic from 'next/dynamic';

const HeroSlider = dynamic(() => import('../homepage/HeroSlider'), {
	ssr: false,
});

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();

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
						<Stack className={'header-basic'}>
							<Box className={'header-basic-container'}>
								<Typography className={'header-title'}>Shop</Typography>
								<Typography className={'header-breadcrumb'}>Home &gt; Products</Typography>
							</Box>
						</Stack>
						<Stack id={'main'}>
							<Component {...props} />
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

export default withLayoutBasic;
