import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Stack, Button } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';

interface CompareTableProps {
	items: Product[];
	onRemove?: (id: string) => void;
	onAddToCart?: (product: Product) => void;
}

const CompareTable: React.FC<CompareTableProps> = ({ items, onRemove, onAddToCart }) => {
	if (items.length === 0) {
		return (
			<Box className="compare-table-empty">
				<Typography variant="h6" className="compare-table-empty-text">
					No products to compare
				</Typography>
			</Box>
		);
	}

	const rows = [
		{ label: 'Image', key: 'image' },
		{ label: 'Title', key: 'title' },
		{ label: 'Brand', key: 'brand' },
		{ label: 'Compatible Model', key: 'compatibility' },
		{ label: 'Year', key: 'year' },
		{ label: 'Price', key: 'price' },
		{ label: 'OEM Number', key: 'oemNumber' },
		{ label: 'Condition', key: 'condition' },
	];

	const getValue = (product: Product, key: string): string | number | React.ReactNode => {
		switch (key) {
			case 'image':
				return (
					<Box
						component="img"
						src={
							product.productImages?.[0]
								? `${REACT_APP_API_URL}/${product.productImages[0]}`
								: '/img/banner/header1.svg'
						}
						alt={product.productTitle}
						className="compare-table-image"
					/>
				);
			case 'title':
				return product.productTitle;
			case 'brand':
				return product.productCarBrand || '—';
			case 'compatibility':
				return product.productCarModel || '—';
			case 'year':
				if (product.productYearFrom && product.productYearTo) {
					return `${product.productYearFrom} - ${product.productYearTo}`;
				}
				if (product.productYearFrom) return product.productYearFrom;
				if (product.productYearTo) return product.productYearTo;
				return '—';
			case 'price':
				// Prefer sale price when available
				const salePrice =
					typeof product.productSalePrice === 'number' && product.productSalePrice > 0
						? product.productSalePrice
						: typeof product.productPrice === 'number'
						? product.productPrice
						: null;
				return salePrice !== null ? `$${salePrice.toFixed(2)}` : '—';
			case 'oemNumber':
				return product.productOemNumbers?.join(', ') || '—';
			case 'condition':
				return product.productCondition || '—';
			default:
				return '—';
		}
	};

	return (
		<Box className="compare-table-container">
			<Grid container spacing={2} className="compare-table-grid">
				{/* Header row with labels */}
				<Grid item xs={12}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3} lg={1.5}>
							<Card className="compare-table-header-card">
								<CardContent className="compare-table-card-content">
									<Typography variant="body2" className="compare-table-header-text">
										Product
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						{items.map((item, index) => (
							<Grid key={item._id || index} item xs={12} sm={6} md={3} lg={2}>
								<Card className="compare-table-product-card">
									<CardContent className="compare-table-card-content">
										{onRemove && (
											<Box className="compare-table-remove-container">
												<Typography
													variant="body2"
													onClick={() => onRemove(item._id as string)}
													className="compare-table-remove-text"
												>
													Remove
												</Typography>
											</Box>
										)}
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Grid>

				{/* Data rows */}
				{rows.map((row) => (
					<Grid key={row.key} item xs={12}>
						<Grid container spacing={2}>
							{/* Label column */}
							<Grid item xs={12} sm={6} md={3} lg={1.5}>
								<Card className="compare-table-label-card">
									<CardContent className="compare-table-card-content compare-table-card-content-full">
										<Typography variant="body2" className="compare-table-label-text">
											{row.label}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							{/* Product columns */}
							{items.map((item, index) => (
								<Grid key={item._id || index} item xs={12} sm={6} md={3} lg={2}>
									<Card className="compare-table-data-card">
										<CardContent className="compare-table-card-content compare-table-card-content-full">
											{typeof getValue(item, row.key) === 'string' ||
											typeof getValue(item, row.key) === 'number' ? (
												<Typography variant="body2" className="compare-table-data-text">
													{getValue(item, row.key) as string | number}
												</Typography>
											) : (
												<Box className="compare-table-image-container">
													{getValue(item, row.key) as React.ReactNode}
												</Box>
											)}
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Grid>
				))}

				{/* Add to Cart row */}
				<Grid item xs={12}>
					<Grid container spacing={2}>
						{/* Empty label column */}
						<Grid item xs={12} sm={6} md={3} lg={1.5}>
							<Card className="compare-table-label-card">
								<CardContent className="compare-table-card-content compare-table-card-content-full">
									<Typography variant="body2" className="compare-table-label-text">
										Action
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						{/* Add to Cart buttons for each product */}
						{items.map((item, index) => (
							<Grid key={item._id || index} item xs={12} sm={6} md={3} lg={2}>
								<Card className="compare-table-data-card">
									<CardContent className="compare-table-card-content compare-table-card-content-full">
										<Button
											variant="contained"
											fullWidth
											startIcon={<ShoppingCartOutlinedIcon />}
											onClick={() => onAddToCart?.(item)}
											className="compare-table-add-to-cart-btn"
										>
											Add to Cart
										</Button>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CompareTable;

