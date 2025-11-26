import React from 'react';
import {
	Dialog,
	DialogContent,
	Box,
	Typography,
	IconButton,
	Button,
	Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCompare } from '../../hooks/useCompare';
import CompareTable from './CompareTable';

interface CompareModalProps {
	open: boolean;
	onClose: () => void;
	onAddToCart?: (product: import('../../apollo/store').CompareProduct) => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ open, onClose, onAddToCart }) => {
	const { items, clearCompare, removeFromCompare } = useCompare();

	const handleClear = () => {
		clearCompare();
		onClose();
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
					<CompareTable items={items} onRemove={removeFromCompare} onAddToCart={onAddToCart} />
				</DialogContent>
			</Box>
		</Dialog>
	);
};

export default CompareModal;

