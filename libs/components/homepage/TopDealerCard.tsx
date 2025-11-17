import React from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface TopDealerProps {
	dealer: {
		id: number;
		name: string;
		type: string;
		image: string;
	};
}

const TopDealerCard = (props: TopDealerProps) => {
	const { dealer } = props;
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="top-dealer-card">
				<img src={dealer.image} alt={dealer.name} />

				<strong>{dealer.name}</strong>
				<span>{dealer.type}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-dealer-card">
				<img src={dealer.image} alt={dealer.name} />

				<strong>{dealer.name}</strong>
				<span>{dealer.type}</span>
			</Stack>
		);
	}
};

export default TopDealerCard;

