import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';
import { Product } from '../libs/types/product/product';

// QuickView Product Interface
export interface QuickViewProduct {
	id: number;
	image: string;
	images?: string[];
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
	discount?: number;
	category?: string;
}

// Initialize theme mode from localStorage or default to 'light'
const getInitialThemeMode = (): 'light' | 'dark' => {
	if (typeof window !== 'undefined') {
		const savedTheme = localStorage.getItem('themeMode');
		if (savedTheme === 'light' || savedTheme === 'dark') {
			return savedTheme;
		}
	}
	return 'light';
};

export const themeVar = makeVar<'light' | 'dark'>(getInitialThemeMode());

export const userVar = makeVar<CustomJwtPayload>({
	_id: '',
	memberType: '',
	memberStatus: '',
	memberAuthType: '',
	memberPhone: '',
	memberNick: '',
	memberFullName: '',
	memberImage: '',
	memberAddress: '',
	memberDesc: '',
	memberArticles: 0,
	memberFollowers: 0,
	memberFollowings: 0,
	memberPoints: 0,
	memberLikes: 0,
	memberViews: 0,
	memberComments: 0,
	memberRank: 0,
	memberWarnings: 0,
	memberBlocks: 0,
	deletedAt: '',
	createdAt: '',
	updatedAt: '',
	memberProducts: 0,
	memberProvider: '',
	memberEmail: '',
	accessToken: '',
	memberProperties: 0, // Keep for backward compatibility
});

// QuickView State
export interface QuickViewState {
	isOpen: boolean;
	product: QuickViewProduct | null;
}

export const quickViewVar = makeVar<QuickViewState>({
	isOpen: false,
	product: null,
});

// QuickView Helper Functions
export const openQuickView = (product: QuickViewProduct) => {
	quickViewVar({
		isOpen: true,
		product,
	});
};

export const closeQuickView = () => {
	quickViewVar({
		isOpen: false,
		product: null,
	});
};

// Initialize compare items from localStorage
const getInitialCompareItems = (): Product[] => {
	if (typeof window !== 'undefined') {
		try {
			const saved = localStorage.getItem('carmoa_compare_items');
			if (saved) {
				const parsed = JSON.parse(saved);
				// Ensure max 6 items
				return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
			}
		} catch (error) {
			console.error('Error loading compare items from localStorage:', error);
		}
	}
	return [];
};

// Compare State
export const compareVar = makeVar<Product[]>(getInitialCompareItems());

// Helper function to sync localStorage with compareVar
export const syncCompareToLocalStorage = (items: Product[]) => {
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem('carmoa_compare_items', JSON.stringify(items));
		} catch (error) {
			console.error('Error saving compare items to localStorage:', error);
		}
	}
};

// Cart Item Interface
export interface CartItem {
	_id: string;
	product: Product;
	quantity: number;
	price: number; // Price at time of adding to cart
}

// Initialize cart items from localStorage
const getInitialCartItems = (): CartItem[] => {
	if (typeof window !== 'undefined') {
		try {
			const saved = localStorage.getItem('cartData');
			if (saved) {
				const parsed = JSON.parse(saved);
				return Array.isArray(parsed) ? parsed : [];
			}
		} catch (error) {
			console.error('Error loading cart items from localStorage:', error);
		}
	}
	return [];
};

// Cart State
export const cartVar = makeVar<CartItem[]>(getInitialCartItems());

// Helper function to sync localStorage with cartVar
export const syncCartToLocalStorage = (items: CartItem[]) => {
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem('cartData', JSON.stringify(items));
		} catch (error) {
			console.error('Error saving cart items to localStorage:', error);
		}
	}
};
