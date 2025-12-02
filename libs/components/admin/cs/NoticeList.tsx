import React from 'react';
import { useRouter } from 'next/router';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
	Chip,
} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';
import { Notice } from '../../../types/notice/notice';
import { NoticeStatus, NoticeVisibleTo } from '../../../enums/notice.enum';
import moment from 'moment';

interface HeadCell {
	disablePadding: boolean;
	id: string;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'content',
		numeric: true,
		disablePadding: false,
		label: 'CONTENT PREVIEW',
	},
	{
		id: 'visibleTo',
		numeric: true,
		disablePadding: false,
		label: 'VISIBLE TO',
	},
	{
		id: 'status',
		numeric: true,
		disablePadding: false,
		label: 'STATUS',
	},
	{
		id: 'createdAt',
		numeric: true,
		disablePadding: false,
		label: 'CREATED DATE',
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface NoticeListType {
	notices: Notice[];
	anchorEl: any;
	menuIconClickHandler: (e: any, index: number) => void;
	menuIconCloseHandler: () => void;
	updateNoticeHandler: (updateData: any, _id: string) => void;
	deleteNoticeHandler: (_id: string) => void;
	openEditModal: (notice: Notice) => void;
}

export const NoticeList = (props: NoticeListType) => {
	const {
		notices,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateNoticeHandler,
		deleteNoticeHandler,
		openEditModal,
	} = props;
	const router = useRouter();

	const getStatusColor = (status: NoticeStatus) => {
		switch (status) {
			case NoticeStatus.ACTIVE:
				return 'success';
			case NoticeStatus.DISABLED:
				return 'error';
			default:
				return 'default';
		}
	};

	const getVisibilityColor = (visibleTo: NoticeVisibleTo) => {
		switch (visibleTo) {
			case NoticeVisibleTo.ALL:
				return 'primary';
			case NoticeVisibleTo.USER:
				return 'info';
			case NoticeVisibleTo.DEALER:
				return 'secondary';
			default:
				return 'default';
		}
	};

	const stripHtml = (html: string) => {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
					<EnhancedTableHead />
					<TableBody>
						{notices?.length > 0 ? (
							notices.map((notice: Notice, index: number) => {
								const contentPreview = stripHtml(notice.content).substring(0, 80);

								return (
									<TableRow hover key={notice._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left" sx={{ maxWidth: '250px' }}>
											<Typography variant="body2" sx={{ fontWeight: 600 }}>
												{notice.title}
											</Typography>
										</TableCell>
										<TableCell align="left" sx={{ maxWidth: '300px' }}>
											<Typography variant="body2" color="text.secondary" noWrap>
												{contentPreview}
												{notice.content.length > 80 && '...'}
											</Typography>
										</TableCell>
										<TableCell align="left">
											<Chip label={notice.visibleTo} color={getVisibilityColor(notice.visibleTo)} size="small" />
										</TableCell>
										<TableCell align="left">
											<Button
												onClick={(e: any) => menuIconClickHandler(e, index)}
												className={`badge ${getStatusColor(notice.status)}`}
												size="small"
											>
												{notice.status}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												<MenuItem
													onClick={() =>
														updateNoticeHandler({ status: NoticeStatus.ACTIVE }, notice._id)
													}
												>
													<Typography variant={'subtitle1'} component={'span'}>
														ACTIVE
													</Typography>
												</MenuItem>
												<MenuItem
													onClick={() =>
														updateNoticeHandler({ status: NoticeStatus.DISABLED }, notice._id)
													}
												>
													<Typography variant={'subtitle1'} component={'span'}>
														DISABLED
													</Typography>
												</MenuItem>
											</Menu>
										</TableCell>
										<TableCell align="left">
											<Typography variant="body2">
												{moment(notice.createdAt).format('YYYY-MM-DD')}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{moment(notice.createdAt).format('HH:mm')}
											</Typography>
										</TableCell>
										<TableCell align="center">
											<Tooltip title="Edit">
												<IconButton onClick={() => openEditModal(notice)} color="primary">
													<NotePencil size={24} weight="fill" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Delete">
												<IconButton onClick={() => deleteNoticeHandler(notice._id)} color="error">
													<DeleteRoundedIcon />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={6} align="center">
									<Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
										No notices found
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
