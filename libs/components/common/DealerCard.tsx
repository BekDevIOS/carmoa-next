import React from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface DealerCardProps {
	dealer: {
		id: number;
		name: string;
		type: string;
		image: string;
	};
}

const DealerCard = (props: DealerCardProps) => {
	const { dealer } = props;
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className="dealer-card">
				<img src={dealer.image} alt={dealer.name} />

				<strong>{dealer.name}</strong>
				<span>{dealer.type}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="dealer-card">
				<img src={dealer.image} alt={dealer.name} />

				<strong>{dealer.name}</strong>
				<span>{dealer.type}</span>
			</Stack>
		);
	}
};

export default DealerCard;

