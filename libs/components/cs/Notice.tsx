import React, { useState } from 'react';
import { Stack, Box, CircularProgress, Typography, Chip } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_PUBLIC_NOTICE_LIST } from '../../../apollo/user/query';
import { Notice as NoticeType } from '../../types/notice/notice';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import moment from 'moment';
import { NoticeVisibleTo } from '../../enums/notice.enum';

interface PublicNoticeListResponse {
	getPublicNoticeList: NoticeType[];
}

const Notice = () => {
	const device = useDeviceDetect();
	const [selectedNotice, setSelectedNotice] = useState<NoticeType | null>(null);

	/** APOLLO REQUESTS **/
	const { data, loading, error } = useQuery<PublicNoticeListResponse>(GET_PUBLIC_NOTICE_LIST, {
		fetchPolicy: 'cache-and-network',
	});

	/** HANDLERS **/
	const handleNoticeClick = (notice: NoticeType) => {
		setSelectedNotice(notice);
	};

	const handleBackToList = () => {
		setSelectedNotice(null);
	};

	const stripHtml = (html: string) => {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	};

	const getVisibilityLabel = (visibleTo: NoticeVisibleTo) => {
		switch (visibleTo) {
			case NoticeVisibleTo.ALL:
				return 'All Users';
			case NoticeVisibleTo.USER:
				return 'Users';
			case NoticeVisibleTo.DEALER:
				return 'Dealers';
			default:
				return '';
		}
	};

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	}

	if (loading) {
		return (
			<Stack className={'notice-content'} alignItems="center" justifyContent="center" sx={{ py: 8 }}>
				<CircularProgress />
				<Typography sx={{ mt: 2 }} color="text.secondary">
					Loading notices...
				</Typography>
			</Stack>
		);
	}

	if (error) {
		return (
			<Stack className={'notice-content'} alignItems="center" justifyContent="center" sx={{ py: 8 }}>
				<Typography color="error">Failed to load notices</Typography>
			</Stack>
		);
	}

	if (selectedNotice) {
		return (
			<Stack className={'notice-content notice-detail'}>
				<Box component={'div'} className={'back-button'} onClick={handleBackToList} sx={{ mb: 3, cursor: 'pointer' }}>
					<Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
						← Back to notices
					</Typography>
				</Box>

				<Box component={'div'} className={'notice-header'} sx={{ mb: 3 }}>
					<Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
						{selectedNotice.title}
					</Typography>
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography variant="body2" color="text.secondary">
							{moment(selectedNotice.createdAt).format('MMMM DD, YYYY')}
						</Typography>
						<Chip label={getVisibilityLabel(selectedNotice.visibleTo)} size="small" color="primary" />
					</Stack>
				</Box>

				<Box
					component={'div'}
					className={'notice-body'}
					sx={{
						'& p': { mb: 2 },
						'& h1, & h2, & h3': { mt: 3, mb: 2 },
						lineHeight: 1.8,
					}}
					dangerouslySetInnerHTML={{ __html: selectedNotice.content }}
				/>

				<Box component={'div'} className={'notice-footer'} sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
					<Typography variant="caption" color="text.secondary">
						Last updated: {moment(selectedNotice.updatedAt).format('MMMM DD, YYYY')}
					</Typography>
				</Box>
			</Stack>
		);
	}

	return (
		<Stack className={'notice-content'}>
			<span className={'title'}>Notice</span>
			<Stack className={'main'}>
				<Box component={'div'} className={'top'}>
					<span>Number</span>
					<span>Title</span>
					<span>Date</span>
				</Box>
				<Stack className={'bottom'}>
					{data?.getPublicNoticeList && data.getPublicNoticeList.length > 0 ? (
						data.getPublicNoticeList.map((notice: NoticeType, index: number) => (
							<div
								className={'notice-card'}
								key={notice._id}
								onClick={() => handleNoticeClick(notice)}
								style={{ cursor: 'pointer' }}
							>
								<span className={'notice-number'}>{index + 1}</span>
								<span className={'notice-title'}>{notice.title}</span>
								<span className={'notice-date'}>{moment(notice.createdAt).format('YYYY.MM.DD')}</span>
							</div>
						))
					) : (
						<Box component={'div'} sx={{ py: 8, textAlign: 'center' }}>
							<Typography color="text.secondary">No notices available at this time</Typography>
						</Box>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Notice;
