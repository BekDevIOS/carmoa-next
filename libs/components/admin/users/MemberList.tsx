import React from 'react';
import Link from 'next/link';
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
	Box,
	Tooltip,
	Chip,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WarningIcon from '@mui/icons-material/Warning';
import { Member } from '../../../types/member/member';
import { getMemberImageUrl } from '../../../config';
import { MemberStatus, MemberType } from '../../../enums/member.enum';

interface Data {
	id: string;
	nickname: string;
	fullname: string;
	phone: string;
	type: string;
	state: string;
	warning: string;
	block: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'nickname',
		numeric: true,
		disablePadding: false,
		label: 'MEMBER',
	},
	{
		id: 'phone',
		numeric: true,
		disablePadding: false,
		label: 'CONTACT',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'warning',
		numeric: false,
		disablePadding: false,
		label: 'WARNINGS',
	},
	{
		id: 'block',
		numeric: false,
		disablePadding: false,
		label: 'BLOCKS',
	},
	{
		id: 'state',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sx={{
							fontWeight: 600,
							fontSize: '13px',
							color: 'var(--carmo-text-secondary)',
							padding: '14px 20px',
						}}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface MemberPanelListType {
	members: Member[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateMemberHandler: any;
}

// Helper functions for status colors
const getMemberTypeInfo = (type: MemberType) => {
	switch (type) {
		case MemberType.USER:
			return { label: '👤 User', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.16)' };
		case MemberType.DEALER:
			return { label: '🏢 Dealer', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.16)' };
		case MemberType.ADMIN:
			return { label: '⚡ Admin', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.16)' };
		default:
			return { label: type, color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
	}
};

const getMemberStatusInfo = (status: MemberStatus) => {
	switch (status) {
		case MemberStatus.ACTIVE:
			return { label: 'Active', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.16)' };
		case MemberStatus.BLOCK:
			return { label: 'Blocked', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.16)' };
		case MemberStatus.DELETED:
			return { label: 'Deleted', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.16)' };
		default:
			return { label: status, color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
	}
};

export const MemberPanelList = (props: MemberPanelListType) => {
	const { members, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateMemberHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{members.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={6}>
									<Box sx={{ py: 4 }}>
										<Typography variant="body1" sx={{ color: 'var(--carmo-text-secondary)' }}>
											No members found
										</Typography>
									</Box>
								</TableCell>
							</TableRow>
						)}

						{members.length !== 0 &&
							members.map((member: Member, index: number) => {
								const typeInfo = getMemberTypeInfo(member.memberType);
								const statusInfo = getMemberStatusInfo(member.memberStatus);
								
								return (
									<TableRow 
										hover 
										key={member?._id} 
										sx={{ 
											'&:last-child td, &:last-child th': { border: 0 },
											height: '72px',
											'&:hover': {
												backgroundColor: 'var(--carmo-bg-soft)',
											}
										}}
									>
										{/* Member Info with Image */}
										<TableCell align="left" sx={{ padding: '20px' }}>
											<Link href={`/member?memberId=${member._id}`} style={{ textDecoration: 'none' }}>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
													<Box component={'div'} className={'profile-img'}>
														<img
															src={getMemberImageUrl(member.memberImage)}
															alt={'member-photo'}
															style={{
																width: '45px',
																height: '45px',
																borderRadius: '50%',
																objectFit: 'cover',
															}}
														/>
													</Box>
													<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
														<span style={{ fontWeight: 500, fontSize: '14px', color: 'var(--carmo-text)' }}>
															{member.memberNick}
														</span>
														{member.memberFullName && (
															<span style={{ fontSize: '12px', color: 'var(--carmo-text-secondary)' }}>
																{member.memberFullName}
															</span>
														)}
													</Box>
												</Box>
											</Link>
										</TableCell>

										{/* Contact Info */}
										<TableCell align="left" sx={{ padding: '20px' }}>
											<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
													<PhoneIcon sx={{ fontSize: '14px', color: 'var(--carmo-text-secondary)' }} />
													<span style={{ fontSize: '13px' }}>{member.memberPhone}</span>
												</Box>
												{member.memberEmail && (
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
														<EmailIcon sx={{ fontSize: '14px', color: 'var(--carmo-text-secondary)' }} />
														<span style={{ fontSize: '12px', color: 'var(--carmo-text-secondary)' }}>
															{member.memberEmail}
														</span>
													</Box>
												)}
											</Box>
										</TableCell>

										{/* Member Type */}
										<TableCell align="left" sx={{ padding: '20px' }}>
											<Tooltip title="Click to change type" placement="top">
												<Button 
													onClick={(e: any) => menuIconClickHandler(e, index)}
													sx={{
														color: typeInfo.color,
														background: typeInfo.bgColor,
														padding: '6px 12px',
														fontWeight: 500,
														fontSize: '12px',
														borderRadius: '6px',
														textTransform: 'none',
														minWidth: 'auto',
														cursor: 'pointer',
														transition: 'all 0.2s',
														'&:hover': {
															background: typeInfo.bgColor,
															transform: 'scale(1.05)',
															boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
														}
													}}
												>
													{typeInfo.label}
												</Button>
											</Tooltip>

											<Menu
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												PaperProps={{
													sx: {
														minWidth: '140px',
														boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
													}
												}}
											>
												{Object.values(MemberType)
													.filter((ele) => ele !== member?.memberType)
													.map((type: string) => {
														const info = getMemberTypeInfo(type as MemberType);
														return (
															<MenuItem
																onClick={() => updateMemberHandler({ _id: member._id, memberType: type })}
																key={type}
																sx={{ fontSize: '13px' }}
															>
																{info.label}
															</MenuItem>
														);
													})}
											</Menu>
										</TableCell>

										{/* Warnings */}
										<TableCell align="left" sx={{ padding: '20px' }}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
												{member.memberWarnings > 0 && (
													<WarningIcon sx={{ fontSize: '16px', color: '#f59e0b' }} />
												)}
												<Chip
													label={member.memberWarnings}
													size="small"
													sx={{
														height: '24px',
														fontSize: '12px',
														fontWeight: 600,
														backgroundColor: member.memberWarnings > 0 ? 'rgba(245, 158, 11, 0.16)' : 'var(--carmo-bg-soft)',
														color: member.memberWarnings > 0 ? '#f59e0b' : 'var(--carmo-text-secondary)',
													}}
												/>
											</Box>
										</TableCell>

										{/* Blocks */}
										<TableCell align="left" sx={{ padding: '20px' }}>
											<Chip
												label={member.memberBlocks}
												size="small"
												sx={{
													height: '24px',
													fontSize: '12px',
													fontWeight: 600,
													backgroundColor: member.memberBlocks > 0 ? 'rgba(239, 68, 68, 0.16)' : 'var(--carmo-bg-soft)',
													color: member.memberBlocks > 0 ? '#ef4444' : 'var(--carmo-text-secondary)',
												}}
											/>
										</TableCell>

										{/* Status */}
										<TableCell align="left" sx={{ padding: '20px' }}>
											<Tooltip title="Click to change status" placement="top">
												<Button 
													onClick={(e: any) => menuIconClickHandler(e, member._id)}
													sx={{
														color: statusInfo.color,
														background: statusInfo.bgColor,
														padding: '6px 12px',
														fontWeight: 500,
														fontSize: '12px',
														borderRadius: '6px',
														textTransform: 'none',
														minWidth: 'auto',
														cursor: 'pointer',
														transition: 'all 0.2s',
														'&:hover': {
															background: statusInfo.bgColor,
															transform: 'scale(1.05)',
															boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
														}
													}}
												>
													{statusInfo.label}
												</Button>
											</Tooltip>

											<Menu
												anchorEl={anchorEl[member._id]}
												open={Boolean(anchorEl[member._id])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												PaperProps={{
													sx: {
														minWidth: '140px',
														boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
													}
												}}
											>
												{Object.values(MemberStatus)
													.filter((ele: string) => ele !== member?.memberStatus)
													.map((status: string) => {
														const info = getMemberStatusInfo(status as MemberStatus);
														return (
															<MenuItem
																onClick={() => updateMemberHandler({ _id: member._id, memberStatus: status })}
																key={status}
																sx={{ fontSize: '13px', color: info.color }}
															>
																{info.label}
															</MenuItem>
														);
													})}
											</Menu>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
