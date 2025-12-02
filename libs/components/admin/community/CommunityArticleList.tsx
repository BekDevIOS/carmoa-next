import React, { useState } from 'react';
import Link from 'next/link';
import {
	Box,
	Button,
	Menu,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	IconButton,
	Chip,
	Divider,
	Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Moment from 'react-moment';
import { BoardArticle } from '../../../types/blog/board-article';
import { getMemberImageUrl } from '../../../config';
import { BoardArticleStatus } from '../../../enums/blog.enum';

interface Data {
	article: string;
	author: string;
	category: string;
	stats: string;
	date: string;
	status: string;
	actions: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'article',
		numeric: false,
		disablePadding: false,
		label: 'ARTICLE',
	},
	{
		id: 'author',
		numeric: false,
		disablePadding: false,
		label: 'AUTHOR',
	},
	{
		id: 'category',
		numeric: false,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'stats',
		numeric: false,
		disablePadding: false,
		label: 'STATS',
	},
	{
		id: 'date',
		numeric: false,
		disablePadding: false,
		label: 'CREATED',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
	{
		id: 'actions',
		numeric: false,
		disablePadding: false,
		label: 'ACTIONS',
	},
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align="left"
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

interface CommunityArticleListProps {
	articles: BoardArticle[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateArticleHandler: any;
	removeArticleHandler: any;
}

// Helper function to get status info
const getStatusInfo = (status: BoardArticleStatus) => {
	switch (status) {
		case BoardArticleStatus.ACTIVE:
			return { label: 'Active', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.16)' };
		case BoardArticleStatus.DELETED:
			return { label: 'Deleted', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
		default:
			return { label: status, color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
	}
};

// Article Row Component
const ArticleRow = ({ 
	article, 
	index,
	anchorEl,
	menuIconClickHandler,
	menuIconCloseHandler,
	updateArticleHandler,
	removeArticleHandler 
}: { 
	article: BoardArticle;
	index: number;
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateArticleHandler: any;
	removeArticleHandler: any;
}) => {
	const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
	const statusInfo = getStatusInfo(article.articleStatus);
	const authorName = article.memberData?.memberNick || article.memberData?.memberPhone || 'Unknown';

	const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setStatusAnchorEl(event.currentTarget);
	};

	const handleStatusMenuClose = () => {
		setStatusAnchorEl(null);
	};

	const handleStatusChange = (status: BoardArticleStatus) => {
		updateArticleHandler({ _id: article._id, articleStatus: status });
		handleStatusMenuClose();
	};

	return (
		<TableRow 
			hover 
			sx={{ 
				'&:last-child td, &:last-child th': { border: 0 },
				height: '72px',
				'&:hover': {
					backgroundColor: 'var(--carmo-bg-soft)',
				}
			}}
		>
			{/* Article Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
					maxWidth: '400px',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
					{article.articleStatus === BoardArticleStatus.ACTIVE ? (
						<Link 
							href={`/blog/detail?articleCategory=${article.articleCategory}&id=${article._id}`}
							style={{ textDecoration: 'none' }}
						>
							<Typography 
								sx={{ 
									fontWeight: 500,
									fontSize: '14px',
									color: 'var(--carmo-text)',
									'&:hover': { color: 'var(--carmo-primary)' },
									cursor: 'pointer',
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
								}}
							>
								{article.articleTitle}
							</Typography>
						</Link>
					) : (
						<Typography 
							sx={{ 
								fontWeight: 500,
								fontSize: '14px',
								color: 'var(--carmo-text)',
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
							}}
						>
							{article.articleTitle}
						</Typography>
					)}
					{article.articleImage && (
						<Typography sx={{ fontSize: '11px', color: 'var(--carmo-text-secondary)' }}>
							📷 Has image
						</Typography>
					)}
				</Box>
			</TableCell>

			{/* Author Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Link 
					href={`/member?memberId=${article?.memberData?._id}`}
					style={{ textDecoration: 'none', color: 'inherit' }}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
						<Avatar
							src={getMemberImageUrl(article.memberData?.memberImage)}
							alt={authorName}
							sx={{ width: 40, height: 40 }}
						/>
						<Box>
							<Typography sx={{ fontWeight: 500, fontSize: '13px' }}>
								{authorName}
							</Typography>
							{article.memberData?.memberEmail && (
								<Typography sx={{ fontSize: '11px', color: 'var(--carmo-text-secondary)' }}>
									{article.memberData.memberEmail}
								</Typography>
							)}
						</Box>
					</Box>
				</Link>
			</TableCell>

			{/* Category Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Chip 
					label={article.articleCategory} 
					size="small" 
					sx={{ 
						fontWeight: 500,
						fontSize: '12px',
						backgroundColor: 'var(--carmo-bg-soft)',
					}}
				/>
			</TableCell>

			{/* Stats Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<VisibilityIcon sx={{ fontSize: '14px', color: 'var(--carmo-text-secondary)' }} />
						<Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
							{article.articleViews || 0}
						</Typography>
						<Typography sx={{ fontSize: '11px', color: 'var(--carmo-text-secondary)' }}>
							views
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<FavoriteIcon sx={{ fontSize: '14px', color: '#ef4444' }} />
						<Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
							{article.articleLikes || 0}
						</Typography>
						<Typography sx={{ fontSize: '11px', color: 'var(--carmo-text-secondary)' }}>
							likes
						</Typography>
					</Box>
				</Box>
			</TableCell>

			{/* Date Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<CalendarTodayIcon sx={{ fontSize: '14px', color: 'var(--carmo-text-secondary)' }} />
					<Typography sx={{ fontSize: '13px' }}>
						<Moment format={'MMM DD, YYYY'}>{article.createdAt}</Moment>
					</Typography>
				</Box>
				<Typography sx={{ fontSize: '11px', color: 'var(--carmo-text-secondary)', mt: 0.5 }}>
					<Moment format={'HH:mm'}>{article.createdAt}</Moment>
				</Typography>
			</TableCell>

			{/* Status Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Tooltip title="Click to change status" placement="top">
					<Button
						onClick={handleStatusMenuOpen}
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
					anchorEl={statusAnchorEl}
					open={Boolean(statusAnchorEl)}
					onClose={handleStatusMenuClose}
					PaperProps={{
						sx: {
							minWidth: '140px',
							boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
						}
					}}
				>
					<MenuItem 
						onClick={() => handleStatusChange(BoardArticleStatus.ACTIVE)}
						sx={{ fontSize: '13px', color: '#22c55e' }}
					>
						✓ Active
					</MenuItem>
					<Divider />
					<MenuItem 
						onClick={() => handleStatusChange(BoardArticleStatus.DELETED)}
						sx={{ fontSize: '13px', color: '#757575' }}
					>
						🗑 Delete
					</MenuItem>
				</Menu>
			</TableCell>

			{/* Actions Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Box sx={{ display: 'flex', gap: 1 }}>
					{article.articleStatus === BoardArticleStatus.ACTIVE && (
						<Tooltip title="View article">
							<Link href={`/blog/detail?articleCategory=${article.articleCategory}&id=${article._id}`}>
								<IconButton size="small" sx={{ color: 'var(--carmo-primary)' }}>
									<OpenInBrowserRoundedIcon fontSize="small" />
								</IconButton>
							</Link>
						</Tooltip>
					)}
					{article.articleStatus === BoardArticleStatus.DELETED && (
						<Tooltip title="Permanently delete">
							<IconButton 
								size="small" 
								onClick={() => removeArticleHandler(article._id)}
								sx={{ color: '#ef4444' }}
							>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					)}
				</Box>
			</TableCell>
		</TableRow>
	);
};

const CommunityArticleList = (props: CommunityArticleListProps) => {
	const { articles, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateArticleHandler, removeArticleHandler } =
		props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{articles.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<Box sx={{ py: 4 }}>
										<Typography variant="body1" sx={{ color: 'var(--carmo-text-secondary)' }}>
											No articles found
										</Typography>
									</Box>
								</TableCell>
							</TableRow>
						)}

						{articles.length !== 0 && articles.map((article: BoardArticle, index: number) => (
							<ArticleRow
								key={article._id}
								article={article}
								index={index}
								anchorEl={anchorEl}
								menuIconClickHandler={menuIconClickHandler}
								menuIconCloseHandler={menuIconCloseHandler}
								updateArticleHandler={updateArticleHandler}
								removeArticleHandler={removeArticleHandler}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

export default CommunityArticleList;
