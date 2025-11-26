import { useReactiveVar } from '@apollo/client';
import { compareVar, CompareProduct, syncCompareToLocalStorage } from '../../apollo/store';

export const useCompare = () => {
	const items = useReactiveVar(compareVar);

	const isCompared = (id: number): boolean => {
		return items.some((item) => item.id === id);
	};

	const addToCompare = (product: CompareProduct): void => {
		const currentItems = compareVar();
		
		// Check if already in compare
		if (isCompared(product.id)) {
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

	const removeFromCompare = (id: number): void => {
		const currentItems = compareVar();
		const newItems = currentItems.filter((item) => item.id !== id);
		compareVar(newItems);
		syncCompareToLocalStorage(newItems);
	};

	const toggleCompare = (product: CompareProduct): void => {
		if (isCompared(product.id)) {
			removeFromCompare(product.id);
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

