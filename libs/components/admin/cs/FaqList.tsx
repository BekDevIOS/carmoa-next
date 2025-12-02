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
import { Faq } from '../../../types/faq/faq';
import { FAQStatus } from '../../../enums/faq.enum';
import moment from 'moment';

interface HeadCell {
	disablePadding: boolean;
	id: string;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'question',
		numeric: true,
		disablePadding: false,
		label: 'QUESTION',
	},
	{
		id: 'answer',
		numeric: true,
		disablePadding: false,
		label: 'ANSWER PREVIEW',
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

interface FaqArticlesPanelListType {
	faqs: Faq[];
	anchorEl: any;
	menuIconClickHandler: (e: any, index: number) => void;
	menuIconCloseHandler: () => void;
	updateFaqHandler: (updateData: any, _id: string) => void;
	deleteFaqHandler: (_id: string) => void;
	openEditModal: (faq: Faq) => void;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const { faqs, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateFaqHandler, deleteFaqHandler, openEditModal } =
		props;
	const router = useRouter();

	const getStatusColor = (status: FAQStatus) => {
		switch (status) {
			case FAQStatus.ACTIVE:
				return 'success';
			case FAQStatus.DISABLED:
				return 'error';
			default:
				return 'default';
		}
	};

	const getCategoryColor = (category: string) => {
		const colors: { [key: string]: any } = {
			ACCOUNT: 'primary',
			ORDER: 'secondary',
			PAYMENT: 'success',
			SHIPPING: 'info',
			RETURNS: 'warning',
			DEALER: 'default',
			GENERAL: 'default',
		};
		return colors[category] || 'default';
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
					<EnhancedTableHead />
					<TableBody>
						{faqs?.length > 0 ? (
							faqs.map((faq: Faq, index: number) => {
								const answerPreview = faq.answer.substring(0, 100);

								return (
									<TableRow hover key={faq._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<Chip label={faq.category} color={getCategoryColor(faq.category)} size="small" />
										</TableCell>
										<TableCell align="left" sx={{ maxWidth: '300px' }}>
											<Typography variant="body2" sx={{ fontWeight: 600 }}>
												{faq.question}
											</Typography>
										</TableCell>
										<TableCell align="left" sx={{ maxWidth: '300px' }}>
											<Typography variant="body2" color="text.secondary" noWrap>
												{answerPreview}
												{faq.answer.length > 100 && '...'}
											</Typography>
										</TableCell>
										<TableCell align="left">
											<Button
												onClick={(e: any) => menuIconClickHandler(e, index)}
												className={`badge ${getStatusColor(faq.status)}`}
												size="small"
											>
												{faq.status}
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
													onClick={() => updateFaqHandler({ status: FAQStatus.ACTIVE }, faq._id)}
												>
													<Typography variant={'subtitle1'} component={'span'}>
														ACTIVE
													</Typography>
												</MenuItem>
												<MenuItem
													onClick={() => updateFaqHandler({ status: FAQStatus.DISABLED }, faq._id)}
												>
													<Typography variant={'subtitle1'} component={'span'}>
														DISABLED
													</Typography>
												</MenuItem>
											</Menu>
										</TableCell>
										<TableCell align="left">
											<Typography variant="body2">
												{moment(faq.createdAt).format('YYYY-MM-DD')}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{moment(faq.createdAt).format('HH:mm')}
											</Typography>
										</TableCell>
										<TableCell align="center">
											<Tooltip title="Edit">
												<IconButton onClick={() => openEditModal(faq)} color="primary">
													<NotePencil size={24} weight="fill" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Delete">
												<IconButton onClick={() => deleteFaqHandler(faq._id)} color="error">
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
										No FAQs found
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
