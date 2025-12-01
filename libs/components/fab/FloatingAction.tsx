import React, { useState } from 'react';
import { Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CartFab from '../cart/CartFab';
import CompareFab from '../compare/CompareFab';
import AiBot from './AiBot';
import Cart from '../Cart';
import CompareModal from '../compare/CompareModal';
import { Product } from '../../types/product/product';
import { useCart } from '../../hooks/useCart';

const FloatingAction: React.FC = () => {
	const device = useDeviceDetect();
	const [cartOpen, setCartOpen] = useState(false);
	const [compareModalOpen, setCompareModalOpen] = useState(false);
	const { addToCart } = useCart();

	// Only render on desktop
	if (device === 'mobile') {
		return null;
	}

	const handleCartClick = () => {
		setCartOpen(true);
	};

	const handleCompareClick = () => {
		setCompareModalOpen(true);
	};

	const handleAiBotClick = () => {
		// AI bot click handler - modal is handled inside AiBot component
	};

	const handleAddToCart = (product: Product) => {
		addToCart(product, 1);
	};

	return (
		<>
			<Box className="floating-action-cluster">
				<Box className="floating-action-item">
					<CartFab onClick={handleCartClick} />
				</Box>
				<Box className="floating-action-item floating-action-center">
					<AiBot onClick={handleAiBotClick} />
				</Box>
				<Box className="floating-action-item">
					<CompareFab onClick={handleCompareClick} />
				</Box>
			</Box>

			<Cart open={cartOpen} onClose={() => setCartOpen(false)} />
			<CompareModal
				open={compareModalOpen}
				onClose={() => setCompareModalOpen(false)}
				onAddToCart={handleAddToCart}
			/>
		</>
	);
};

export default FloatingAction;

