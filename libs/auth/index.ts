import decodeJWT from 'jwt-decode';
import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { CustomJwtPayload } from '../types/customJwtPayload';
import { sweetMixinErrorAlert } from '../sweetAlert';
import { LOGIN, SIGN_UP } from '../../apollo/user/mutation';

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
		const { jwtToken } = await requestJwtToken({ email, password });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
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
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { memberEmail: email, memberPassword: password } },
			fetchPolicy: 'network-only',
		});

		console.log('---------- login ----------');
		const { accessToken } = result?.data?.login;

		return { jwtToken: accessToken };
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
		const { jwtToken } = await requestSignUpJwtToken({ nick, email, password, phone, type });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err) {
		console.warn('login err', err);
		logOut();
		// throw new Error('Login Err');
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
}): Promise<{ jwtToken: string }> => {
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
		const { accessToken } = result?.data?.signup;

		return { jwtToken: accessToken };
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

export const updateUserInfo = (jwtToken: any) => {
	if (!jwtToken) return false;

	const claims = decodeJWT<CustomJwtPayload>(jwtToken);
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
