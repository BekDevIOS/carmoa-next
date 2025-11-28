import React from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface DealerCardProps {
	dealer: Member;
}

const DealerCard = (props: DealerCardProps) => {
	const { dealer } = props;
	const device = useDeviceDetect();
	const dealerImage = dealer?.memberImage
		? `${process.env.REACT_APP_API_URL}/${dealer?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return (
			<Stack className="dealer-card">
				<div className="dealer-image-wrapper">
					<img src={dealerImage} alt={dealer.memberNick} />
				</div>

				<strong>{dealer.memberNick}</strong>
				<span>{dealer.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="dealer-card">
				<div className="dealer-image-wrapper">
					<img src={dealerImage} alt={dealer.memberNick} />
				</div>

				<strong>{dealer.memberNick}</strong>
				<span>{dealer.memberType}</span>
			</Stack>
		);
	}
};

export default DealerCard;

