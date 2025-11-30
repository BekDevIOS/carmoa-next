import decodeJWT from 'jwt-decode';
import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { CustomJwtPayload } from '../types/customJwtPayload';
import { sweetMixinErrorAlert } from '../sweetAlert';
import { GOOGLE_LOGIN, LOGIN, SIGN_UP } from '../../apollo/user/mutation';

export function getJwtToken(): any {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
}

export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export const logIn = async (email: string, password: string): Promise<void> => {
	try {
		const { jwtToken, memberData } = await requestJwtToken({ email, password });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken, memberData);
		}
	} catch (err) {
		console.warn('login err', err);
		logOut();
		// throw new Error('Login Err');
	}
};

const requestJwtToken = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<{ jwtToken: string; memberData?: any }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { memberEmail: email, memberPassword: password } },
			fetchPolicy: 'network-only',
		});

		console.log('---------- login ----------');
		const loginData = result?.data?.login;
		const { accessToken } = loginData;

		return { jwtToken: accessToken, memberData: loginData };
	} catch (err: any) {
		console.log('request token err', err.graphQLErrors);
		switch (err.graphQLErrors[0].message) {
			case 'Definer: login and password do not match':
				await sweetMixinErrorAlert('Please check your password again');
				break;
			case 'Definer: user has been blocked!':
				await sweetMixinErrorAlert('User has been blocked!');
				break;
		}
		throw new Error('token error');
	}
};

export const signUp = async (nick: string, email: string, password: string, phone: string, type: string): Promise<void> => {
	try {
		const { jwtToken, memberData } = await requestSignUpJwtToken({ nick, email, password, phone, type });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken, memberData);
		}
	} catch (err) {
		console.warn('login err', err);
		logOut();
		// throw new Error('Login Err');
	}
};

/**
 * Google Login Handler
 * 
 * Sends Google ID token to backend for verification and authentication.
 * Backend verifies token, creates/updates user, and returns JWT access token.
 * 
 * @param idToken - Google ID token from google.accounts.id credential response
 * @throws Error with descriptive message if login fails
 */
export const googleLogIn = async (idToken: string): Promise<void> => {
	if (!idToken || typeof idToken !== 'string') {
		throw new Error('Invalid Google token provided.');
	}

	try {
		const apolloClient = await initializeApollo();

		const result = await apolloClient.mutate({
			mutation: GOOGLE_LOGIN,
			variables: { input: { idToken } },
			fetchPolicy: 'network-only',
		});

		const { accessToken } = result?.data?.googleLogin || {};

		if (!accessToken) {
			throw new Error('Backend did not return an access token.');
		}

		// Store token and update user info
		const googleLoginData = result?.data?.googleLogin;
		updateStorage({ jwtToken: accessToken });
		updateUserInfo(accessToken, googleLoginData);
	} catch (err: any) {
		console.error('Google login error:', err);

		// Extract meaningful error message
		let errorMessage = 'Google login failed. Please try again.';

		if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
			const graphQLError = err.graphQLErrors[0];
			const message = graphQLError.message;

			// Handle specific backend error messages
			if (message.includes('expired') || message.includes('ExpiredTokenError')) {
				errorMessage = 'Google token has expired. Please try again.';
			} else if (message.includes('invalid') || message.includes('InvalidTokenError')) {
				errorMessage = 'Invalid Google token. Please try again.';
			} else if (message.includes('blocked')) {
				errorMessage = 'Your account has been blocked. Please contact support.';
			} else if (message) {
				errorMessage = message;
			}
		} else if (err?.networkError) {
			errorMessage = 'Network error. Please check your connection and try again.';
		} else if (err?.message) {
			errorMessage = err.message;
		}

		// Clear any partial auth state
		logOut();

		throw new Error(errorMessage);
	}
};

const requestSignUpJwtToken = async ({
	nick,
	email,
	password,
	phone,
	type,
}: {
	nick: string;
	email: string;
	password: string;
	phone: string;
	type: string;
}): Promise<{ jwtToken: string; memberData?: any }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: { memberNick: nick, memberEmail: email, memberPassword: password, memberPhone: phone, memberType: type },
			},
			fetchPolicy: 'network-only',
		});

		console.log('---------- login ----------');
		const signupData = result?.data?.signup;
		const { accessToken } = signupData;

		return { jwtToken: accessToken, memberData: signupData };
	} catch (err: any) {
		console.log('request token err', err.graphQLErrors);
		switch (err.graphQLErrors[0].message) {
			case 'Definer: login and password do not match':
				await sweetMixinErrorAlert('Please check your password again');
				break;
			case 'Definer: user has been blocked!':
				await sweetMixinErrorAlert('User has been blocked!');
				break;
		}
		throw new Error('token error');
	}
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
	setJwtToken(jwtToken);
	window.localStorage.setItem('login', Date.now().toString());
};

export const updateUserInfo = (jwtToken: any, memberData?: any) => {
	if (!jwtToken) return false;

	const claims = decodeJWT<CustomJwtPayload>(jwtToken);
	
	// Extract address data from GraphQL response if available, otherwise from JWT claims
	const shippingAddress = memberData?.memberShippingAddress || claims.memberShippingAddress;
	const billingAddress = memberData?.memberBillingAddress || claims.memberBillingAddress;
	
	userVar({
		_id: claims._id ?? '',
		memberType: claims.memberType ?? '',
		memberStatus: claims.memberStatus ?? '',
		memberAuthType: claims.memberAuthType,
		memberPhone: claims.memberPhone ?? '',
		memberNick: claims.memberNick ?? '',
		memberFullName: claims.memberFullName ?? '',
		memberImage:
			claims.memberImage === null || claims.memberImage === undefined
				? '/img/profile/defaultUser.svg'
				: `${claims.memberImage}`,
		memberAddress: claims.memberAddress ?? '',
		memberShippingAddress: shippingAddress,
		memberBillingAddress: billingAddress,
		memberDesc: claims.memberDesc ?? '',
		memberArticles: claims.memberArticles ?? 0,
		memberFollowers: claims.memberFollowers ?? 0,
		memberFollowings: claims.memberFollowings ?? 0,
		memberPoints: claims.memberPoints ?? 0,
		memberLikes: claims.memberLikes ?? 0,
		memberViews: claims.memberViews ?? 0,
		memberComments: claims.memberComments ?? 0,
		memberRank: claims.memberRank ?? 0,
		memberWarnings: claims.memberWarnings ?? 0,
		memberBlocks: claims.memberBlocks ?? 0,
		deletedAt: claims.deletedAt ?? '',
		createdAt: claims.createdAt ?? '',
		updatedAt: claims.updatedAt ?? '',
		memberProducts: claims.memberProducts ?? 0,
		memberProvider: claims.memberProvider ?? '',
		memberEmail: claims.memberEmail ?? '',
		accessToken: claims.accessToken ?? '',
		memberProperties: claims.memberProperties ?? 0, // Keep for backward compatibility
	});
};

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	// window.location.reload();
};

const deleteStorage = () => {
	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
};

const deleteUserInfo = () => {
	userVar({
		_id: '',
		memberType: '',
		memberStatus: '',
		memberAuthType: '',
		memberPhone: '',
		memberNick: '',
		memberFullName: '',
		memberImage: '',
		memberAddress: '',
		memberShippingAddress: undefined,
		memberBillingAddress: undefined,
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
};
