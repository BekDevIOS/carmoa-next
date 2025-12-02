import React, { useState } from 'react';
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
	MenuItem,
	Box,
	Chip,
	Tooltip,
	IconButton,
	Divider,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Product } from '../../../types/product/product';
import { getMemberImageUrl } from '../../../config';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import Typography from '@mui/material/Typography';
import { ProductStatus, ProductCondition } from '../../../enums/product.enum';

interface Data {
	product: string;
	dealer: string;
	price: string;
	stock: string;
	condition: string;
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
		id: 'product',
		numeric: false,
		disablePadding: false,
		label: 'PRODUCT',
	},
	{
		id: 'dealer',
		numeric: false,
		disablePadding: false,
		label: 'DEALER',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'stock',
		numeric: false,
		disablePadding: false,
		label: 'STOCK',
	},
	{
		id: 'condition',
		numeric: false,
		disablePadding: false,
		label: 'CONDITION',
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

interface ProductPanelListType {
	products: Product[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateProductHandler: any;
	removeProductHandler: any;
}

// Helper function to format price
const formatPrice = (price: number): string => {
	return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to get status info
const getStatusInfo = (status: ProductStatus) => {
	switch (status) {
		case ProductStatus.ACTIVE:
			return { label: 'Active', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.16)' };
		case ProductStatus.HOLD:
			return { label: 'On Hold', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.16)' };
		case ProductStatus.SOLD_OUT:
			return { label: 'Sold Out', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.16)' };
		case ProductStatus.DELETED:
			return { label: 'Deleted', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
		default:
			return { label: status, color: '#757575', bgColor: 'rgba(117, 117, 117, 0.16)' };
	}
};

// Helper function to get condition info
const getConditionInfo = (condition: ProductCondition) => {
	switch (condition) {
		case ProductCondition.NEW:
			return { label: 'New', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' };
		case ProductCondition.USED:
			return { label: 'Used', color: '#facc15', bgColor: 'rgba(250, 204, 21, 0.1)' };
		case ProductCondition.REFURBISHED:
			return { label: 'Refurbished', color: '#38bdf8', bgColor: 'rgba(56, 189, 248, 0.1)' };
		default:
			return { label: condition, color: '#757575', bgColor: 'rgba(117, 117, 117, 0.1)' };
	}
};

// Product Row Component
const ProductRow = ({ 
	product, 
	index,
	anchorEl,
	menuIconClickHandler,
	menuIconCloseHandler,
	updateProductHandler,
	removeProductHandler 
}: { 
	product: Product;
	index: number;
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateProductHandler: any;
	removeProductHandler: any;
}) => {
	const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
	const productImage = product.productImages?.[0] 
		? `${REACT_APP_API_URL}/${product.productImages[0]}` 
		: '/img/placeholder.png';
	const statusInfo = getStatusInfo(product.productStatus);
	const conditionInfo = getConditionInfo(product.productCondition);
	const dealerName = product.memberData?.memberNick || product.memberData?.memberPhone || '-';
	const hasDiscount = product.productSalePrice && product.productSalePrice < product.productPrice;

	const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setStatusAnchorEl(event.currentTarget);
	};

	const handleStatusMenuClose = () => {
		setStatusAnchorEl(null);
	};

	const handleStatusChange = (status: ProductStatus) => {
		updateProductHandler({ _id: product._id, productStatus: status });
		handleStatusMenuClose();
	};

	return (
		<TableRow 
			hover 
			sx={{ 
				'&:last-child td, &:last-child th': { border: 0 },
				height: '80px',
				'&:hover': {
					backgroundColor: 'var(--carmo-bg-soft)',
				}
			}}
		>
			{/* Product Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Avatar 
						src={productImage} 
						alt={product.productTitle}
						variant="rounded"
						sx={{ 
							width: 60, 
							height: 60,
							border: '1px solid var(--carmo-border)',
						}}
					/>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
						{product.productStatus === ProductStatus.ACTIVE ? (
							<Link href={`/product/detail?id=${product._id}`} style={{ textDecoration: 'none' }}>
								<Typography 
									sx={{ 
										fontWeight: 500,
										fontSize: '14px',
										color: 'var(--carmo-text)',
										'&:hover': { color: 'var(--carmo-primary)' },
										cursor: 'pointer',
									}}
								>
									{product.productTitle}
								</Typography>
							</Link>
						) : (
							<Typography 
								sx={{ 
									fontWeight: 500,
									fontSize: '14px',
									color: 'var(--carmo-text)',
								}}
							>
								{product.productTitle}
							</Typography>
						)}
						<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
							<Chip 
								label={product.productMainCategory} 
								size="small" 
								sx={{ 
									height: '18px', 
									fontSize: '10px',
									fontWeight: 500,
								}}
							/>
							{product.productOemNumbers && product.productOemNumbers.length > 0 && (
								<Typography sx={{ fontSize: '11px', color: 'var(--carmo-text-secondary)' }}>
									OEM: {product.productOemNumbers[0]}
								</Typography>
							)}
						</Box>
					</Box>
				</Box>
			</TableCell>

			{/* Dealer Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Avatar
						src={getMemberImageUrl(product.memberData?.memberImage)}
						alt={dealerName}
						sx={{ width: 40, height: 40 }}
					/>
					<Box>
						<Typography sx={{ fontWeight: 500, fontSize: '13px' }}>
							{dealerName}
						</Typography>
						{product.memberData?.memberPhone && (
							<Typography sx={{ fontSize: '11px', color: 'var(--carmo-text-secondary)' }}>
								{product.memberData.memberPhone}
							</Typography>
						)}
					</Box>
				</Box>
			</TableCell>

			{/* Price Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
					{hasDiscount ? (
						<>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Typography sx={{ 
									fontSize: '15px', 
									fontWeight: 700,
									color: 'var(--carmo-primary)',
								}}>
									{formatPrice(product.productSalePrice!)}
								</Typography>
								<Chip 
									icon={<LocalOfferIcon sx={{ fontSize: '12px !important' }} />}
									label={`${Math.round((1 - product.productSalePrice! / product.productPrice) * 100)}% OFF`}
									size="small"
									sx={{ 
										height: '18px',
										fontSize: '10px',
										backgroundColor: '#ef4444',
										color: 'white',
										fontWeight: 600,
									}}
								/>
							</Box>
							<Typography sx={{ 
								fontSize: '12px', 
								color: 'var(--carmo-text-secondary)',
								textDecoration: 'line-through',
							}}>
								{formatPrice(product.productPrice)}
							</Typography>
						</>
					) : (
						<Typography sx={{ fontSize: '15px', fontWeight: 700 }}>
							{formatPrice(product.productPrice)}
						</Typography>
					)}
				</Box>
			</TableCell>

			{/* Stock Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<InventoryIcon sx={{ fontSize: '16px', color: 'var(--carmo-text-secondary)' }} />
					<Typography sx={{ 
						fontWeight: 500,
						color: product.productStock > 10 ? 'var(--carmo-text)' : product.productStock > 0 ? '#fb923c' : '#ef4444',
					}}>
						{product.productStock}
					</Typography>
					<Typography sx={{ fontSize: '12px', color: 'var(--carmo-text-secondary)' }}>
						units
					</Typography>
				</Box>
			</TableCell>

			{/* Condition Column */}
			<TableCell 
				align="left"
				sx={{ 
					padding: '20px',
					fontSize: '14px',
				}}
			>
				<Chip 
					label={conditionInfo.label}
					sx={{
						color: conditionInfo.color,
						backgroundColor: conditionInfo.bgColor,
						fontWeight: 500,
						fontSize: '12px',
						height: '24px',
					}}
				/>
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
						onClick={() => handleStatusChange(ProductStatus.ACTIVE)}
						sx={{ fontSize: '13px', color: '#22c55e' }}
					>
						✓ Active
					</MenuItem>
					<MenuItem 
						onClick={() => handleStatusChange(ProductStatus.HOLD)}
						sx={{ fontSize: '13px', color: '#fb923c' }}
					>
						⏸ Hold
					</MenuItem>
					<MenuItem 
						onClick={() => handleStatusChange(ProductStatus.SOLD_OUT)}
						sx={{ fontSize: '13px', color: '#ef4444' }}
					>
						✕ Sold Out
					</MenuItem>
					<Divider />
					<MenuItem 
						onClick={() => handleStatusChange(ProductStatus.DELETED)}
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
					{product.productStatus === ProductStatus.ACTIVE && (
						<Tooltip title="View product">
							<Link href={`/product/detail?id=${product._id}`}>
								<IconButton size="small" sx={{ color: 'var(--carmo-primary)' }}>
									<VisibilityIcon fontSize="small" />
								</IconButton>
							</Link>
						</Tooltip>
					)}
					{product.productStatus === ProductStatus.DELETED && (
						<Tooltip title="Permanently delete">
							<IconButton 
								size="small" 
								onClick={() => removeProductHandler(product._id)}
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

export const ProductPanelList = (props: ProductPanelListType) => {
	const {
		products,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateProductHandler,
		removeProductHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{products.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<Box sx={{ py: 4 }}>
										<Typography variant="body1" sx={{ color: 'var(--carmo-text-secondary)' }}>
											No products found
										</Typography>
									</Box>
								</TableCell>
							</TableRow>
						)}

						{products.length !== 0 && products.map((product: Product, index: number) => (
							<ProductRow
								key={product._id}
								product={product}
								index={index}
								anchorEl={anchorEl}
								menuIconClickHandler={menuIconClickHandler}
								menuIconCloseHandler={menuIconCloseHandler}
								updateProductHandler={updateProductHandler}
								removeProductHandler={removeProductHandler}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

