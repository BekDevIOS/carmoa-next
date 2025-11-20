import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';

interface AdvertisementProps {
	videoSrc?: string;
}

const Advertisement = ({ videoSrc = '/video/homepage.mp4' }: AdvertisementProps) => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'video-frame'}>
				<video
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				>
					<source src={videoSrc} type="video/mp4" />
				</video>
			</Stack>
		);
	} else {
		return (
			<Stack className={'video-frame'}>
				<video
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				>
					<source src={videoSrc} type="video/mp4" />
				</video>
			</Stack>
		);
	}
};

export default Advertisement;

