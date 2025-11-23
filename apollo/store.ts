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
	memberProperties: 0,
	memberRank: 0,
	memberArticles: 0,
	memberPoints: 0,
	memberLikes: 0,
	memberViews: 0,
	memberWarnings: 0,
	memberBlocks: 0,
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
