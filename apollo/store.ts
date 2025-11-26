import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';

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

// Compare Product Interface
export interface CompareProduct {
	id: number;
	image: string;
	category?: string;
	title: string;
	originalPrice?: number;
	salePrice: number;
	discount?: number;
	rating?: number;
	compatibility?: string;
	condition?: 'New' | 'Used' | 'Refurbished';
	isSale?: boolean;
	brand?: string;
	oemNumber?: string;
	year?: number;
}

// Initialize compare items from localStorage
const getInitialCompareItems = (): CompareProduct[] => {
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
export const compareVar = makeVar<CompareProduct[]>(getInitialCompareItems());

// Helper function to sync localStorage with compareVar
export const syncCompareToLocalStorage = (items: CompareProduct[]) => {
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem('carmoa_compare_items', JSON.stringify(items));
		} catch (error) {
			console.error('Error saving compare items to localStorage:', error);
		}
	}
};
