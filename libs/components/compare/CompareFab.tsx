import React, { useState, useEffect } from 'react';
import { Box, Fab, Badge } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useCompare } from '../../hooks/useCompare';

interface CompareFabProps {
	onClick: () => void;
}

const CompareFab: React.FC<CompareFabProps> = ({ onClick }) => {
	const { items } = useCompare();
	const [shouldPulse, setShouldPulse] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Only render on client side to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	// Trigger pulse animation when first item is added
	useEffect(() => {
		if (items.length === 1) {
			setShouldPulse(true);
			const timer = setTimeout(() => setShouldPulse(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [items.length]);

	// Don't render until mounted (client-side only)
	if (!mounted || items.length === 0) {
		return null;
	}

	return (
		<Box className={`compare-fab ${shouldPulse ? 'pulse' : ''}`}>
			<Badge badgeContent={items.length} color="error" className="compare-fab-badge">
				<Fab
					aria-label="compare products"
					onClick={onClick}
					className="compare-fab-button"
				>
					<CompareArrowsIcon />
				</Fab>
			</Badge>
		</Box>
	);
};

export default CompareFab;

