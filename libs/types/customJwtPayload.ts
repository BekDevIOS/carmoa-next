import { JwtPayload } from 'jwt-decode';
import { MemberShippingAddress, MemberBillingAddress } from './member/member';

export interface CustomJwtPayload extends JwtPayload {
	_id: string;
	memberType: string;
	memberStatus: string;
	memberAuthType: string;
	memberPhone: string;
	memberNick: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberShippingAddress?: MemberShippingAddress;
	memberBillingAddress?: MemberBillingAddress;
	memberDesc?: string;
	memberArticles: number;
	memberFollowers: number;
	memberFollowings: number;
	memberPoints: number;
	memberLikes: number;
	memberViews: number;
	memberComments: number;
	memberRank: number;
	memberWarnings: number;
	memberBlocks: number;
	deletedAt?: string;
	createdAt?: string;
	updatedAt?: string;
	memberProducts: number;
	memberProvider?: string;
	memberEmail?: string;
	accessToken?: string;
	memberProperties?: number; // Keep for backward compatibility
}
