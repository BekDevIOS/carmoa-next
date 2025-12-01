import { useCallback } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Product } from '../types/product/product';
import { cartVar, syncCartToLocalStorage } from '../../apollo/store';
import type { CartItem } from '../../apollo/store';
import { sweetMixinErrorAlert } from '../sweetAlert';

export type { CartItem };

export const useCart = () => {
	// Use reactive variable for real-time updates across all components
	const cartItems = useReactiveVar(cartVar);

	const addToCart = useCallback((product: Product, quantity: number = 1) => {
		const currentItems = cartVar();
		const existingItemIndex = currentItems.findIndex((item) => item._id === product._id);
		
		// Get max available stock
		const maxStock = product.productStock || 0;
		
		let updatedItems: CartItem[];
		
		if (existingItemIndex >= 0) {
			// Update quantity if product already in cart
			updatedItems = [...currentItems];
			const currentQuantity = updatedItems[existingItemIndex].quantity;
			const requestedQuantity = currentQuantity + quantity;
			
			if (requestedQuantity > maxStock) {
				sweetMixinErrorAlert(`Only ${maxStock} item${maxStock !== 1 ? 's' : ''} available in stock`).then();
			}
			
			const newQuantity = Math.min(requestedQuantity, maxStock);
			
			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				quantity: newQuantity,
			};
		} else {
			// Add new item to cart - limit quantity to available stock
			if (quantity > maxStock) {
				sweetMixinErrorAlert(`Only ${maxStock} item${maxStock !== 1 ? 's' : ''} available in stock`).then();
			}
			
			const limitedQuantity = Math.min(quantity, maxStock);
			const price = product.productSalePrice && product.productSalePrice > 0 
				? product.productSalePrice 
				: product.productPrice || 0;
			
			updatedItems = [
				...currentItems,
				{
					_id: product._id,
					product,
					quantity: limitedQuantity,
					price,
				},
			];
		}
		
		cartVar(updatedItems);
		syncCartToLocalStorage(updatedItems);
	}, []);

	const removeFromCart = useCallback((productId: string) => {
		const currentItems = cartVar();
		const updatedItems = currentItems.filter((item) => item._id !== productId);
		cartVar(updatedItems);
		syncCartToLocalStorage(updatedItems);
	}, []);

	const updateQuantity = useCallback((productId: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(productId);
			return;
		}
		
		const currentItems = cartVar();
		const updatedItems = currentItems.map((item) => {
			if (item._id === productId) {
				// Limit quantity to available product stock
				const maxStock = item.product?.productStock || 0;
				
				if (quantity > maxStock) {
					sweetMixinErrorAlert(`Only ${maxStock} item${maxStock !== 1 ? 's' : ''} available in stock`).then();
				}
				
				const limitedQuantity = Math.min(quantity, maxStock);
				return { ...item, quantity: limitedQuantity };
			}
			return item;
		});
		cartVar(updatedItems);
		syncCartToLocalStorage(updatedItems);
	}, [removeFromCart]);

	const clearCart = useCallback(() => {
		cartVar([]);
		syncCartToLocalStorage([]);
	}, []);

	const getCartTotal = useCallback(() => {
		return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
	}, [cartItems]);

	const getCartCount = useCallback(() => {
		return cartItems.reduce((count, item) => count + item.quantity, 0);
	}, [cartItems]);

	return {
		cartItems,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		getCartTotal,
		getCartCount,
	};
};

