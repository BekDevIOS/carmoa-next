import { useReactiveVar } from '@apollo/client';
import { compareVar, syncCompareToLocalStorage } from '../../apollo/store';
import { Product } from '../types/product/product';

export const useCompare = () => {
	const items = useReactiveVar(compareVar);

	const isCompared = (id: string): boolean => {
		return items.some((item) => item._id === id);
	};

	const addToCompare = (product: Product): void => {
		const currentItems = compareVar();
		
		// Check if already in compare
		if (isCompared(product._id)) {
			return;
		}

		// Enforce max 6 items
		if (currentItems.length >= 6) {
			// Remove the first item (oldest) and add the new one
			const newItems = [...currentItems.slice(1), product];
			compareVar(newItems);
			syncCompareToLocalStorage(newItems);
		} else {
			const newItems = [...currentItems, product];
			compareVar(newItems);
			syncCompareToLocalStorage(newItems);
		}
	};

	const removeFromCompare = (id: string): void => {
		const currentItems = compareVar();
		const newItems = currentItems.filter((item) => item._id !== id);
		compareVar(newItems);
		syncCompareToLocalStorage(newItems);
	};

	const toggleCompare = (product: Product): void => {
		if (isCompared(product._id)) {
			removeFromCompare(product._id);
		} else {
			addToCompare(product);
		}
	};

	const clearCompare = (): void => {
		compareVar([]);
		syncCompareToLocalStorage([]);
	};

	return {
		items,
		isCompared,
		addToCompare,
		removeFromCompare,
		toggleCompare,
		clearCompare,
	};
};

