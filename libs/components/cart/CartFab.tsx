import React, { useState, useEffect } from 'react';
import { Box, Fab, Badge } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCart } from '../../hooks/useCart';

interface CartFabProps {
	onClick: () => void;
}

const CartFab: React.FC<CartFabProps> = ({ onClick }) => {
	const { cartItems, getCartCount } = useCart();
	const [shouldPulse, setShouldPulse] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [prevCartCount, setPrevCartCount] = useState(0);

	// Only render on client side to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	// Calculate current cart count
	const currentCartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

	// Trigger pulse animation when items are added
	useEffect(() => {
		if (mounted && currentCartCount > prevCartCount && prevCartCount >= 0) {
			setShouldPulse(true);
			const timer = setTimeout(() => setShouldPulse(false), 2000);
			return () => clearTimeout(timer);
		}
		setPrevCartCount(currentCartCount);
	}, [cartItems, mounted, currentCartCount, prevCartCount]);

	// Don't render until mounted (client-side only) or if cart is empty
	if (!mounted || cartItems.length === 0) {
		return null;
	}

	const cartCount = getCartCount();

	return (
		<Box className={`cart-fab ${shouldPulse ? 'pulse' : ''}`}>
			<Badge badgeContent={cartCount} color="error" className="cart-fab-badge">
				<Fab
					aria-label="shopping cart"
					onClick={onClick}
					className="cart-fab-button"
				>
					<ShoppingCartOutlinedIcon />
				</Fab>
			</Badge>
		</Box>
	);
};

export default CartFab;

