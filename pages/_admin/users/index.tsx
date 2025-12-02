import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { MemberPanelList } from '../../../libs/components/admin/users/MemberList';
import { Box, InputAdornment, List, ListItem, Stack, CircularProgress, Chip, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MembersInquiry } from '../../../libs/types/member/member.input';
import { Member } from '../../../libs/types/member/member';
import { MemberStatus, MemberType } from '../../../libs/enums/member.enum';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { MemberUpdate } from '../../../libs/types/member/member.update';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const AdminUsers: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>(initialInquiry);
	const [members, setMembers] = useState<Member[]>([]);
	const [membersTotal, setMembersTotal] = useState<number>(0);
	const [value, setValue] = useState(
		membersInquiry?.search?.memberStatus ? membersInquiry?.search?.memberStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

	const {
		loading: getAllMembersByAdminLoading,
		data: getAllMembersByAdminData,
		error: getAllMembersByAdminError,
		refetch: getAllMembersRefetch,
	} = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: membersInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMembers(data?.getAllMembersByAdmin?.list);
			setMembersTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllMembersRefetch({ input: membersInquiry }).then();
	}, [membersInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		membersInquiry.page = newPage + 1;
		await getAllMembersRefetch({ input: membersInquiry });
		setMembersInquiry({ ...membersInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		membersInquiry.limit = parseInt(event.target.value, 10);
		membersInquiry.page = 1;
		await getAllMembersRefetch({ input: membersInquiry });
		setMembersInquiry({ ...membersInquiry });
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
		setSearchText('');

		setMembersInquiry({ ...membersInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.ACTIVE } });
				break;
			case 'BLOCK':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.BLOCK } });
				break;
			case 'DELETED':
				setMembersInquiry({ ...membersInquiry, search: { memberStatus: MemberStatus.DELETED } });
				break;
			default:
				delete membersInquiry?.search?.memberStatus;
				setMembersInquiry({ ...membersInquiry });
				break;
		}
	};

	const updateMemberHandler = async (updateData: MemberUpdate) => {
		try {
			await updateMemberByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllMembersRefetch({ input: membersInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setMembersInquiry({
				...membersInquiry,
				search: {
					...membersInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setMembersInquiry({
					...membersInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...membersInquiry.search,
						memberType: newValue as MemberType,
					},
				});
			} else {
				delete membersInquiry?.search?.memberType;
				setMembersInquiry({ ...membersInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	// Calculate statistics
	const userCount = members.filter(m => m.memberType === MemberType.USER).length;
	const dealerCount = members.filter(m => m.memberType === MemberType.DEALER).length;
	const activeCount = members.filter(m => m.memberStatus === MemberStatus.ACTIVE).length;
	const blockedCount = members.filter(m => m.memberStatus === MemberStatus.BLOCK).length;

	return (
		<Box component={'div'} className={'content'}>
			{/* Header Section */}
			<Box sx={{ mb: '32px' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '16px' }}>
					<Box>
						<Typography variant={'h2'} className={'tit'} sx={{ mb: '4px', fontSize: '28px', fontWeight: 700 }}>
							User Management
						</Typography>
						<Typography variant={'body2'} sx={{ color: 'var(--carmo-text-secondary)', fontSize: '14px' }}>
							Manage users, dealers, and platform members
						</Typography>
					</Box>
				</Box>

				{/* Statistics Cards */}
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6} md={3}>
						<Box sx={{ 
							p: 3, 
							backgroundColor: 'var(--carmo-bg)', 
							borderRadius: '16px',
							border: '1px solid var(--carmo-border)',
							transition: 'transform 0.2s',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
							}
						}}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant={'caption'} sx={{ color: 'var(--carmo-text-secondary)', fontSize: '12px', fontWeight: 600 }}>
									TOTAL MEMBERS
								</Typography>
								<PersonIcon sx={{ color: '#3b82f6', fontSize: '24px' }} />
							</Box>
							<Typography variant={'h4'} sx={{ fontWeight: 700, fontSize: '32px', color: '#3b82f6' }}>
								{membersTotal}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Box sx={{ 
							p: 3, 
							backgroundColor: 'var(--carmo-bg)', 
							borderRadius: '16px',
							border: '1px solid var(--carmo-border)',
							transition: 'transform 0.2s',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
							}
						}}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant={'caption'} sx={{ color: 'var(--carmo-text-secondary)', fontSize: '12px', fontWeight: 600 }}>
									DEALERS (B2B)
								</Typography>
								<BusinessIcon sx={{ color: '#f59e0b', fontSize: '24px' }} />
							</Box>
							<Typography variant={'h4'} sx={{ fontWeight: 700, fontSize: '32px', color: '#f59e0b' }}>
								{dealerCount}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Box sx={{ 
							p: 3, 
							backgroundColor: 'var(--carmo-bg)', 
							borderRadius: '16px',
							border: '1px solid var(--carmo-border)',
							transition: 'transform 0.2s',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
							}
						}}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant={'caption'} sx={{ color: 'var(--carmo-text-secondary)', fontSize: '12px', fontWeight: 600 }}>
									ACTIVE MEMBERS
								</Typography>
								<CheckCircleIcon sx={{ color: '#22c55e', fontSize: '24px' }} />
							</Box>
							<Typography variant={'h4'} sx={{ fontWeight: 700, fontSize: '32px', color: '#22c55e' }}>
								{activeCount}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Box sx={{ 
							p: 3, 
							backgroundColor: 'var(--carmo-bg)', 
							borderRadius: '16px',
							border: '1px solid var(--carmo-border)',
							transition: 'transform 0.2s',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
							}
						}}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant={'caption'} sx={{ color: 'var(--carmo-text-secondary)', fontSize: '12px', fontWeight: 600 }}>
									BLOCKED
								</Typography>
								<BlockIcon sx={{ color: '#ef4444', fontSize: '24px' }} />
							</Box>
							<Typography variant={'h4'} sx={{ fontWeight: 700, fontSize: '32px', color: '#ef4444' }}>
								{blockedCount}
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</Box>

			<Box component={'div'} className={'table-wrap'} sx={{ 
				backgroundColor: 'var(--carmo-bg)', 
				borderRadius: '16px', 
				border: '1px solid var(--carmo-border)',
				overflow: 'hidden'
			}}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'} sx={{ p: '20px' }}>
							{/* Filter Tabs */}
							<Box sx={{ mb: 3 }}>
								<Typography variant={'subtitle2'} sx={{ mb: 1.5, fontWeight: 600, fontSize: '13px', color: 'var(--carmo-text-secondary)' }}>
									FILTER BY STATUS
								</Typography>
								<Stack direction={'row'} spacing={1} flexWrap={'wrap'} gap={1}>
									<Chip
										label="All"
										onClick={(e: any) => tabChangeHandler(e, 'ALL')}
										sx={{
											backgroundColor: value === 'ALL' ? 'var(--carmo-primary)' : 'var(--carmo-bg-soft)',
											color: value === 'ALL' ? 'white' : 'var(--carmo-text)',
											fontWeight: value === 'ALL' ? 600 : 400,
											cursor: 'pointer',
											'&:hover': {
												backgroundColor: value === 'ALL' ? 'var(--carmo-primary)' : 'var(--carmo-border)',
											}
										}}
									/>
									<Chip
										label="Active"
										onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
										sx={{
											backgroundColor: value === 'ACTIVE' ? '#22c55e' : 'var(--carmo-bg-soft)',
											color: value === 'ACTIVE' ? 'white' : 'var(--carmo-text)',
											fontWeight: value === 'ACTIVE' ? 600 : 400,
											cursor: 'pointer',
											'&:hover': {
												backgroundColor: value === 'ACTIVE' ? '#22c55e' : 'var(--carmo-border)',
											}
										}}
									/>
									<Chip
										label="Blocked"
										onClick={(e: any) => tabChangeHandler(e, 'BLOCK')}
										sx={{
											backgroundColor: value === 'BLOCK' ? '#ef4444' : 'var(--carmo-bg-soft)',
											color: value === 'BLOCK' ? 'white' : 'var(--carmo-text)',
											fontWeight: value === 'BLOCK' ? 600 : 400,
											cursor: 'pointer',
											'&:hover': {
												backgroundColor: value === 'BLOCK' ? '#ef4444' : 'var(--carmo-border)',
											}
										}}
									/>
									<Chip
										label="Deleted"
										onClick={(e: any) => tabChangeHandler(e, 'DELETED')}
										sx={{
											backgroundColor: value === 'DELETED' ? '#64748b' : 'var(--carmo-bg-soft)',
											color: value === 'DELETED' ? 'white' : 'var(--carmo-text)',
											fontWeight: value === 'DELETED' ? 600 : 400,
											cursor: 'pointer',
											'&:hover': {
												backgroundColor: value === 'DELETED' ? '#64748b' : 'var(--carmo-border)',
											}
										}}
									/>
								</Stack>
							</Box>

							{/* Search Area */}
							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Box sx={{ position: 'relative', flex: 1 }}>
									<OutlinedInput
										value={searchText}
										onChange={(e: any) => textHandler(e.target.value)}
										sx={{ 
											width: '100%',
											height: '48px',
											background: 'var(--carmo-bg)',
											fontSize: '14px',
											'& .MuiOutlinedInput-notchedOutline': {
												borderColor: 'var(--carmo-border)',
											},
											'&:hover .MuiOutlinedInput-notchedOutline': {
												borderColor: 'var(--carmo-primary)',
											},
										}}
										placeholder="Search by name, phone, or email..."
										onKeyDown={(event) => {
											if (event.key == 'Enter') searchTextHandler();
										}}
										endAdornment={
											<>
												{searchText && (
													<CancelRoundedIcon
														style={{ cursor: 'pointer', marginRight: '8px' }}
														onClick={async () => {
															setSearchText('');
															setMembersInquiry({
																...membersInquiry,
																search: {
																	...membersInquiry.search,
																	text: '',
																},
															});
															await getAllMembersRefetch({ input: membersInquiry });
														}}
													/>
												)}
												<InputAdornment position="end" onClick={() => searchTextHandler()} sx={{ cursor: 'pointer' }}>
													<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
												</InputAdornment>
												{getAllMembersByAdminLoading && (
													<CircularProgress 
														size={20} 
														sx={{ position: 'absolute', right: '50px' }} 
													/>
												)}
											</>
										}
									/>
								</Box>
								<Select 
									sx={{ 
										width: '180px',
										height: '48px',
										background: 'var(--carmo-bg)',
										fontSize: '14px',
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: 'var(--carmo-border)',
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: 'var(--carmo-primary)',
										},
									}} 
									value={searchType}
								>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										All Types
									</MenuItem>
									<MenuItem value={'USER'} onClick={() => searchTypeHandler('USER')}>
										👤 Users
									</MenuItem>
									<MenuItem value={'DEALER'} onClick={() => searchTypeHandler('DEALER')}>
										🏢 Dealers
									</MenuItem>
									<MenuItem value={'ADMIN'} onClick={() => searchTypeHandler('ADMIN')}>
										⚡ Admins
									</MenuItem>
								</Select>
							</Stack>
						</Box>
						<Divider />
						<MemberPanelList
							members={members}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateMemberHandler={updateMemberHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={membersTotal}
							rowsPerPage={membersInquiry?.limit}
							page={membersInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminUsers.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminUsers);
