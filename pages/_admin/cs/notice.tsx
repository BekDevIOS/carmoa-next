import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box,
	Button,
	InputAdornment,
	Stack,
	Modal,
	TextField,
	FormControl,
	InputLabel,
	IconButton,
} from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CloseIcon from '@mui/icons-material/Close';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTICE_LIST } from '../../../apollo/admin/query';
import { CREATE_NOTICE, DELETE_NOTICE, UPDATE_NOTICE } from '../../../apollo/admin/mutation';
import { NoticeInquiry } from '../../../libs/types/notice/notice.input';
import { Notice } from '../../../libs/types/notice/notice';
import { NoticeStatus, NoticeVisibleTo } from '../../../libs/enums/notice.enum';
import { Direction } from '../../../libs/enums/common.enum';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';

const AdminNotice: NextPage = ({ initialInquiry, ...props }: any) => {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [noticeInquiry, setNoticeInquiry] = useState<NoticeInquiry>(
		initialInquiry || {
			page: 1,
			limit: 10,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {},
		},
	);
	const [notices, setNotices] = useState<Notice[]>([]);
	const [noticeTotal, setNoticeTotal] = useState<number>(0);
	const [value, setValue] = useState('ALL');
	const [searchType, setSearchType] = useState<'title' | 'visibleTo'>('title');
	const [searchText, setSearchText] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		visibleTo: NoticeVisibleTo.ALL,
		status: NoticeStatus.ACTIVE,
	});

	/** APOLLO REQUESTS **/
	const [createNotice] = useMutation(CREATE_NOTICE);
	const [updateNotice] = useMutation(UPDATE_NOTICE);
	const [deleteNotice] = useMutation(DELETE_NOTICE);

	const {
		loading: getNoticeListLoading,
		data: getNoticeListData,
		error: getNoticeListError,
		refetch: getNoticeListRefetch,
	} = useQuery(GET_NOTICE_LIST, {
		fetchPolicy: 'network-only',
		variables: { input: noticeInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getNoticeList?.list || []);
			setNoticeTotal(data?.getNoticeList?.metaCounter[0]?.total ?? 0);
		},
		onError: (error) => {
			console.error('GET_NOTICE_LIST Error:', error);
			setNotices([]);
			setNoticeTotal(0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getNoticeListRefetch({ input: noticeInquiry }).then();
	}, [noticeInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		const updatedInquiry = { ...noticeInquiry, page: newPage + 1 };
		setNoticeInquiry(updatedInquiry);
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const updatedInquiry = {
			...noticeInquiry,
			limit: parseInt(event.target.value, 10),
			page: 1,
		};
		setNoticeInquiry(updatedInquiry);
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		let updatedInquiry = { ...noticeInquiry, page: 1, sort: 'createdAt' };

		switch (newValue) {
			case 'ACTIVE':
				updatedInquiry.search = { status: NoticeStatus.ACTIVE };
				break;
			case 'DISABLED':
				updatedInquiry.search = { status: NoticeStatus.DISABLED };
				break;
			default:
				updatedInquiry.search = {};
				break;
		}

		setNoticeInquiry(updatedInquiry);
	};

	const searchTypeHandler = (newValue: string) => {
		setSearchType(newValue as 'title' | 'visibleTo');
	};

	const handleInputChange = (value: string) => {
		setSearchText(value);
	};

	const searchTargetHandler = async () => {
		try {
			let updatedInquiry = { ...noticeInquiry, page: 1 };

			if (searchText === '') {
				// Clear search
				const { text, visibleTo, ...rest } = updatedInquiry.search;
				updatedInquiry.search = rest;
				setNoticeInquiry(updatedInquiry);
				return;
			}

			if (searchType === 'title') {
				const { visibleTo, ...rest } = updatedInquiry.search;
				updatedInquiry.search = { ...rest, text: searchText };
			} else {
				const { text, ...rest } = updatedInquiry.search;
				updatedInquiry.search = { ...rest, visibleTo: searchText as NoticeVisibleTo };
			}

			setNoticeInquiry(updatedInquiry);
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const updateNoticeHandler = async (updateData: any, _id: string) => {
		try {
			await updateNotice({
				variables: {
					input: {
						_id: _id,
						...updateData,
					},
				},
			});
			await getNoticeListRefetch({ input: noticeInquiry });
			menuIconCloseHandler();
			sweetTopSmallSuccessAlert('Notice updated successfully!', 700);
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err);
		}
	};

	const deleteNoticeHandler = async (_id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this notice?')) {
				await deleteNotice({
					variables: {
						_id: _id,
					},
				});
				await getNoticeListRefetch({ input: noticeInquiry });
				sweetTopSmallSuccessAlert('Notice deleted successfully!', 700);
			}
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const statusCountHandler = (status: string) => {
		if (status === 'ALL') {
			return noticeTotal;
		}
		return notices?.filter((notice) => notice.status === status).length || 0;
	};

	const handleOpenModal = () => {
		setEditMode(false);
		setEditingNoticeId(null);
		setFormData({
			title: '',
			content: '',
			visibleTo: NoticeVisibleTo.ALL,
			status: NoticeStatus.ACTIVE,
		});
		setOpenModal(true);
	};

	const handleOpenEditModal = (notice: Notice) => {
		setEditMode(true);
		setEditingNoticeId(notice._id);
		setFormData({
			title: notice.title,
			content: notice.content,
			visibleTo: notice.visibleTo,
			status: notice.status,
		});
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setEditMode(false);
		setEditingNoticeId(null);
		setFormData({
			title: '',
			content: '',
			visibleTo: NoticeVisibleTo.ALL,
			status: NoticeStatus.ACTIVE,
		});
	};

	const handleFormChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleCreateNotice = async () => {
		try {
			if (!formData.title.trim() || !formData.content.trim()) {
				sweetErrorHandling(new Error('Please fill in all required fields'));
				return;
			}

			await createNotice({
				variables: {
					input: formData,
				},
			});

			await getNoticeListRefetch({ input: noticeInquiry });
			sweetTopSmallSuccessAlert('Notice created successfully!', 700);
			handleCloseModal();
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const handleUpdateNotice = async () => {
		try {
			if (!formData.title.trim() || !formData.content.trim()) {
				sweetErrorHandling(new Error('Please fill in all required fields'));
				return;
			}

			if (!editingNoticeId) {
				sweetErrorHandling(new Error('Notice ID is missing'));
				return;
			}

			await updateNotice({
				variables: {
					input: {
						_id: editingNoticeId,
						...formData,
					},
				},
			});

			await getNoticeListRefetch({ input: noticeInquiry });
			sweetTopSmallSuccessAlert('Notice updated successfully!', 700);
			handleCloseModal();
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const handleSubmitNotice = () => {
		if (editMode) {
			handleUpdateNotice();
		} else {
			handleCreateNotice();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Notice Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={handleOpenModal}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All ({statusCountHandler('ALL')})
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active ({statusCountHandler('ACTIVE')})
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'DISABLED')}
									value="DISABLED"
									className={value === 'DISABLED' ? 'li on' : 'li'}
								>
									Disabled ({statusCountHandler('DISABLED')})
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select
									sx={{ width: '160px', mr: '20px' }}
									value={searchType}
									onChange={(e) => searchTypeHandler(e.target.value)}
								>
									<MenuItem value={'title'}>Title</MenuItem>
									<MenuItem value={'visibleTo'}>Visible To</MenuItem>
								</Select>

								<OutlinedInput
									value={searchText}
									onChange={(e) => handleInputChange(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={
										searchType === 'title'
											? 'Search by title...'
											: 'Search by visibility (USER, DEALER, ALL)...'
									}
									onKeyDown={(event) => {
										if (event.key === 'Enter') searchTargetHandler().then();
									}}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													onClick={() => {
														setSearchText('');
														const { text, visibleTo, ...rest } = noticeInquiry.search;
														setNoticeInquiry({ ...noticeInquiry, search: rest, page: 1 });
													}}
													style={{ cursor: 'pointer' }}
												/>
											)}
											<InputAdornment position="end" onClick={searchTargetHandler} style={{ cursor: 'pointer' }}>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<NoticeList
							notices={notices}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateNoticeHandler={updateNoticeHandler}
							deleteNoticeHandler={deleteNoticeHandler}
							openEditModal={handleOpenEditModal}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={noticeTotal}
							rowsPerPage={noticeInquiry.limit}
							page={noticeInquiry.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>

			{/* Create Notice Modal */}
			<Modal
				open={openModal}
				onClose={handleCloseModal}
				aria-labelledby="create-notice-modal"
				aria-describedby="create-notice-form"
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: { xs: '90%', sm: '600px', md: '700px' },
						maxHeight: '90vh',
						overflow: 'auto',
						bgcolor: 'background.paper',
						borderRadius: '8px',
						boxShadow: 24,
						p: 4,
					}}
				>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
						<Typography variant="h5" component="h2">
							{editMode ? 'Edit Notice' : 'Create New Notice'}
						</Typography>
						<IconButton onClick={handleCloseModal} size="small">
							<CloseIcon />
						</IconButton>
					</Box>

					<Stack spacing={3}>
						<TextField
							fullWidth
							required
							label="Title"
							value={formData.title}
							onChange={(e) => handleFormChange('title', e.target.value)}
							placeholder="Enter notice title"
							inputProps={{ maxLength: 200 }}
							helperText={`${formData.title.length}/200 characters`}
						/>

						<TextField
							fullWidth
							required
							label="Content"
							value={formData.content}
							onChange={(e) => handleFormChange('content', e.target.value)}
							placeholder="Enter notice content"
							multiline
							minRows={30}
							helperText={`${formData.content.length} characters`}
							InputProps={{
								sx: {
									alignItems: 'flex-start',
									padding: '16.5px 14px',
									height: '200px',
									overflowY: 'auto',
								},
							}}
							sx={{
								'& .MuiInputBase-input': {
									overflow: 'visible !important',
									padding: 0,
								},
							}}
						/>

						<FormControl fullWidth>
							<InputLabel id="visible-to-label">Visible To</InputLabel>
							<Select
								labelId="visible-to-label"
								value={formData.visibleTo}
								label="Visible To"
								onChange={(e) => handleFormChange('visibleTo', e.target.value)}
							>
								<MenuItem value={NoticeVisibleTo.ALL}>All Users</MenuItem>
								<MenuItem value={NoticeVisibleTo.USER}>Users Only</MenuItem>
								<MenuItem value={NoticeVisibleTo.DEALER}>Dealers Only</MenuItem>
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel id="status-label">Status</InputLabel>
							<Select
								labelId="status-label"
								value={formData.status}
								label="Status"
								onChange={(e) => handleFormChange('status', e.target.value)}
							>
								<MenuItem value={NoticeStatus.ACTIVE}>Active</MenuItem>
								<MenuItem value={NoticeStatus.DISABLED}>Disabled</MenuItem>
							</Select>
						</FormControl>

						<Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2 }}>
							<Button variant="outlined" onClick={handleCloseModal}>
								Cancel
							</Button>
							<Button
								variant="contained"
								onClick={handleSubmitNotice}
								disabled={!formData.title.trim() || !formData.content.trim()}
							>
								{editMode ? 'Update Notice' : 'Create Notice'}
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Modal>
		</Box>
	);
};

AdminNotice.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	},
};

export default withAdminLayout(AdminNotice);
