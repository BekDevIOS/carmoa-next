import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	Box,
	Typography,
	IconButton,
	Button,
	Stack,
	Snackbar,
	Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCompare } from '../../hooks/useCompare';
import CompareTable from './CompareTable';
import { Product } from '../../types/product/product';

interface CompareModalProps {
	open: boolean;
	onClose: () => void;
	onAddToCart?: (product: Product) => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ open, onClose, onAddToCart }) => {
	const { items, clearCompare, removeFromCompare } = useCompare();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleClear = () => {
		clearCompare();
		onClose();
	};

	const handleAddToCartWithNotification = (product: Product) => {
		if (onAddToCart) {
			onAddToCart(product);
			setSnackbarMessage('Product added to cart');
			setSnackbarOpen(true);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={false}
			fullWidth
			PaperProps={{
				className: 'compare-modal-paper',
			}}
			BackdropProps={{
				className: 'compare-modal-backdrop',
			}}
			className="compare-modal"
		>
			<Box className="compare-modal-container">
				{/* Header */}
				<Box className="compare-modal-header">
					<Stack direction="row" alignItems="center" justifyContent="space-between" className="compare-modal-header-stack">
						<Typography variant="h5" component="h2" className="compare-modal-title">
							Compare Products {items.length > 0 && `(${items.length})`}
						</Typography>
						<Stack direction="row" spacing={1} alignItems="center">
							{items.length > 0 && (
								<Button
									startIcon={<DeleteOutlineIcon />}
									onClick={handleClear}
									className="compare-modal-clear-btn"
								>
									Clear
								</Button>
							)}
							<IconButton onClick={onClose} className="compare-modal-close-btn">
								<CloseIcon />
							</IconButton>
						</Stack>
					</Stack>
				</Box>

				{/* Content */}
				<DialogContent className="compare-modal-content">
					<CompareTable items={items} onRemove={removeFromCompare} onAddToCart={handleAddToCartWithNotification} />
				</DialogContent>
			</Box>
			
			{/* In-Modal Snackbar Notification */}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={2000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				sx={{
					position: 'absolute',
					top: 80,
					zIndex: 9999,
				}}
			>
				<Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Dialog>
	);
};

export default CompareModal;

