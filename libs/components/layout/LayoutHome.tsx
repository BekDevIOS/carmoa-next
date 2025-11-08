import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Footer from '../Footer';
import { Stack } from '@mui/material';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import TopBar from '../navbar/TopBar';
import MainBar from '../navbar/MainBar';
import ActionBar from '../navbar/ActionBar';

const withLayoutMain = (Component: any) => {
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
						<Stack id={'top'}>
						<MainBar />
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
		} else {
			return (
				<>
					<Head>
						<title>CarMoa</title>
						<meta name={'title'} content={`CarMoa`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'} className='navbar'>
							<TopBar />
							<MainBar />
							<ActionBar />
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

export default withLayoutMain;
