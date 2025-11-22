import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';

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
