import { useState } from 'react';

interface Product {
	id: number;
	images?: string[];
	image?: string;
	title: string;
	originalPrice?: number;
	salePrice: number;
	isSale?: boolean;
	rating?: number;
	description?: string;
	compatibility?: string;
	condition?: 'New' | 'Used' | 'Refurbished';
	stockStatus?: 'In stock' | 'Out of stock';
	brands?: string[];
}

export const useQuickView = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const openQuickView = (product: Product) => {
		setSelectedProduct(product);
		setIsOpen(true);
	};

	const closeQuickView = () => {
		setIsOpen(false);
		// Delay clearing product to allow exit animation to complete
		setTimeout(() => {
			setSelectedProduct(null);
		}, 300);
	};

	return {
		isOpen,
		selectedProduct,
		openQuickView,
		closeQuickView,
	};
};

