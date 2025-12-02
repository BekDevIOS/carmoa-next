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
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { useMutation, useQuery } from '@apollo/client';
import { GET_FAQ_LIST } from '../../../apollo/admin/query';
import { CREATE_FAQ, DELETE_FAQ, UPDATE_FAQ } from '../../../apollo/admin/mutation';
import { FaqInquiry } from '../../../libs/types/faq/faq.input';
import { Faq } from '../../../libs/types/faq/faq';
import { FAQCategory, FAQStatus } from '../../../libs/enums/faq.enum';
import { Direction } from '../../../libs/enums/common.enum';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';

const AdminFaq: NextPage = ({ initialInquiry, ...props }: any) => {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [faqInquiry, setFaqInquiry] = useState<FaqInquiry>(
		initialInquiry || {
			page: 1,
			limit: 10,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {},
		},
	);
	const [faqs, setFaqs] = useState<Faq[]>([]);
	const [faqTotal, setFaqTotal] = useState<number>(0);
	const [value, setValue] = useState('ALL');
	const [searchType, setSearchType] = useState<'question' | 'category'>('question');
	const [searchText, setSearchText] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		category: FAQCategory.GENERAL,
		question: '',
		answer: '',
		status: FAQStatus.ACTIVE,
	});

	/** APOLLO REQUESTS **/
	const [createFaq] = useMutation(CREATE_FAQ);
	const [updateFaq] = useMutation(UPDATE_FAQ);
	const [deleteFaq] = useMutation(DELETE_FAQ);

	const {
		loading: getFaqListLoading,
		data: getFaqListData,
		error: getFaqListError,
		refetch: getFaqListRefetch,
	} = useQuery(GET_FAQ_LIST, {
		fetchPolicy: 'network-only',
		variables: { input: faqInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFaqs(data?.getFaqList?.list || []);
			setFaqTotal(data?.getFaqList?.metaCounter[0]?.total ?? 0);
		},
		onError: (error) => {
			console.error('GET_FAQ_LIST Error:', error);
			setFaqs([]);
			setFaqTotal(0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getFaqListRefetch({ input: faqInquiry }).then();
	}, [faqInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		const updatedInquiry = { ...faqInquiry, page: newPage + 1 };
		setFaqInquiry(updatedInquiry);
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const updatedInquiry = {
			...faqInquiry,
			limit: parseInt(event.target.value, 10),
			page: 1,
		};
		setFaqInquiry(updatedInquiry);
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

		let updatedInquiry = { ...faqInquiry, page: 1, sort: 'createdAt' };

		switch (newValue) {
			case 'ACTIVE':
				updatedInquiry.search = { status: FAQStatus.ACTIVE };
				break;
			case 'DISABLED':
				updatedInquiry.search = { status: FAQStatus.DISABLED };
				break;
			default:
				updatedInquiry.search = {};
				break;
		}

		setFaqInquiry(updatedInquiry);
	};

	const searchTypeHandler = (newValue: string) => {
		setSearchType(newValue as 'question' | 'category');
	};

	const handleInputChange = (value: string) => {
		setSearchText(value);
	};

	const searchTargetHandler = async () => {
		try {
			let updatedInquiry = { ...faqInquiry, page: 1 };

			if (searchText === '') {
				// Clear search
				const { text, category, ...rest } = updatedInquiry.search;
				updatedInquiry.search = rest;
				setFaqInquiry(updatedInquiry);
				return;
			}

			if (searchType === 'question') {
				const { category, ...rest } = updatedInquiry.search;
				updatedInquiry.search = { ...rest, text: searchText };
			} else {
				const { text, ...rest } = updatedInquiry.search;
				updatedInquiry.search = { ...rest, category: searchText as FAQCategory };
			}

			setFaqInquiry(updatedInquiry);
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const updateFaqHandler = async (updateData: any, _id: string) => {
		try {
			await updateFaq({
				variables: {
					input: {
						_id: _id,
						...updateData,
					},
				},
			});
			await getFaqListRefetch({ input: faqInquiry });
			menuIconCloseHandler();
			sweetTopSmallSuccessAlert('FAQ updated successfully!', 700);
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err);
		}
	};

	const deleteFaqHandler = async (_id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this FAQ?')) {
				await deleteFaq({
					variables: {
						_id: _id,
					},
				});
				await getFaqListRefetch({ input: faqInquiry });
				sweetTopSmallSuccessAlert('FAQ deleted successfully!', 700);
			}
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const statusCountHandler = (status: string) => {
		if (status === 'ALL') {
			return faqTotal;
		}
		return faqs?.filter((faq) => faq.status === status).length || 0;
	};

	const handleOpenModal = () => {
		setEditMode(false);
		setEditingFaqId(null);
		setFormData({
			category: FAQCategory.GENERAL,
			question: '',
			answer: '',
			status: FAQStatus.ACTIVE,
		});
		setOpenModal(true);
	};

	const handleOpenEditModal = (faq: Faq) => {
		setEditMode(true);
		setEditingFaqId(faq._id);
		setFormData({
			category: faq.category,
			question: faq.question,
			answer: faq.answer,
			status: faq.status,
		});
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setEditMode(false);
		setEditingFaqId(null);
		setFormData({
			category: FAQCategory.GENERAL,
			question: '',
			answer: '',
			status: FAQStatus.ACTIVE,
		});
	};

	const handleFormChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleCreateFaq = async () => {
		try {
			if (!formData.question.trim() || !formData.answer.trim()) {
				sweetErrorHandling(new Error('Please fill in all required fields'));
				return;
			}

			await createFaq({
				variables: {
					input: formData,
				},
			});

			await getFaqListRefetch({ input: faqInquiry });
			sweetTopSmallSuccessAlert('FAQ created successfully!', 700);
			handleCloseModal();
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const handleUpdateFaq = async () => {
		try {
			if (!formData.question.trim() || !formData.answer.trim()) {
				sweetErrorHandling(new Error('Please fill in all required fields'));
				return;
			}

			if (!editingFaqId) {
				sweetErrorHandling(new Error('FAQ ID is missing'));
				return;
			}

			await updateFaq({
				variables: {
					input: {
						_id: editingFaqId,
						...formData,
					},
				},
			});

			await getFaqListRefetch({ input: faqInquiry });
			sweetTopSmallSuccessAlert('FAQ updated successfully!', 700);
			handleCloseModal();
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const handleSubmitFaq = () => {
		if (editMode) {
			handleUpdateFaq();
		} else {
			handleCreateFaq();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>FAQ Management</Typography>
				<Button className="btn_add" variant={'contained'} size={'medium'} onClick={handleOpenModal}>
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
									<MenuItem value={'question'}>Question</MenuItem>
									<MenuItem value={'category'}>Category</MenuItem>
								</Select>

								<OutlinedInput
									value={searchText}
									onChange={(e) => handleInputChange(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder={
										searchType === 'question'
											? 'Search by question...'
											: 'Search by category (ACCOUNT, ORDER, etc.)...'
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
														const { text, category, ...rest } = faqInquiry.search;
														setFaqInquiry({ ...faqInquiry, search: rest, page: 1 });
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
						<FaqArticlesPanelList
							faqs={faqs}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateFaqHandler={updateFaqHandler}
							deleteFaqHandler={deleteFaqHandler}
							openEditModal={handleOpenEditModal}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={faqTotal}
							rowsPerPage={faqInquiry.limit}
							page={faqInquiry.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>

			{/* Create/Edit FAQ Modal */}
			<Modal open={openModal} onClose={handleCloseModal} aria-labelledby="faq-modal" aria-describedby="faq-form">
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
							{editMode ? 'Edit FAQ' : 'Create New FAQ'}
						</Typography>
						<IconButton onClick={handleCloseModal} size="small">
							<CloseIcon />
						</IconButton>
					</Box>

					<Stack spacing={3}>
						<FormControl fullWidth>
							<InputLabel id="category-label">Category</InputLabel>
							<Select
								labelId="category-label"
								value={formData.category}
								label="Category"
								onChange={(e) => handleFormChange('category', e.target.value)}
							>
								<MenuItem value={FAQCategory.ACCOUNT}>Account</MenuItem>
								<MenuItem value={FAQCategory.ORDER}>Order</MenuItem>
								<MenuItem value={FAQCategory.PAYMENT}>Payment</MenuItem>
								<MenuItem value={FAQCategory.SHIPPING}>Shipping</MenuItem>
								<MenuItem value={FAQCategory.RETURNS}>Returns</MenuItem>
								<MenuItem value={FAQCategory.DEALER}>Dealer</MenuItem>
								<MenuItem value={FAQCategory.GENERAL}>General</MenuItem>
							</Select>
						</FormControl>

						<TextField
							fullWidth
							required
							label="Question"
							value={formData.question}
							onChange={(e) => handleFormChange('question', e.target.value)}
							placeholder="Enter the FAQ question"
							inputProps={{ maxLength: 500 }}
							helperText={`${formData.question.length}/500 characters`}
						/>

						<TextField
							fullWidth
							required
							label="Answer"
							value={formData.answer}
							onChange={(e) => handleFormChange('answer', e.target.value)}
							placeholder="Enter the FAQ answer"
							multiline
							minRows={6}
							helperText={`${formData.answer.length} characters`}
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
							<InputLabel id="status-label">Status</InputLabel>
							<Select
								labelId="status-label"
								value={formData.status}
								label="Status"
								onChange={(e) => handleFormChange('status', e.target.value)}
							>
								<MenuItem value={FAQStatus.ACTIVE}>Active</MenuItem>
								<MenuItem value={FAQStatus.DISABLED}>Disabled</MenuItem>
							</Select>
						</FormControl>

						<Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2 }}>
							<Button variant="outlined" onClick={handleCloseModal}>
								Cancel
							</Button>
							<Button
								variant="contained"
								onClick={handleSubmitFaq}
								disabled={!formData.question.trim() || !formData.answer.trim()}
							>
								{editMode ? 'Update FAQ' : 'Create FAQ'}
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Modal>
		</Box>
	);
};

AdminFaq.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	},
};

export default withAdminLayout(AdminFaq);
