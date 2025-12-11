import React from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { getMemberImageUrl } from '../../config';

interface DealerCardProps {
	dealer: Member;
}

const DealerCard = (props: DealerCardProps) => {
	const { dealer } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const dealerImage = getMemberImageUrl(dealer?.memberImage);

	const handleDealerClick = () => {
		if (dealer?._id) {
			router.push(`/dealer/detail?dealerId=${dealer._id}`);
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className="dealer-card mobile" onClick={handleDealerClick} sx={{ cursor: 'pointer', width: '100%' }}>
				<div className="dealer-image-wrapper mobile">
					<img src={dealerImage} alt={dealer.memberNick} className="dealer-image mobile" />
				</div>
				<Stack className="dealer-info mobile">
					<strong className="dealer-name mobile">{dealer.memberNick}</strong>
					<span className="dealer-type mobile">{dealer.memberType}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="dealer-card" onClick={handleDealerClick} sx={{ cursor: 'pointer' }}>
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

