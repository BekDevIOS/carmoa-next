import { MemberAuthType, MemberProvider, MemberStatus, MemberType } from '../../enums/member.enum';
import { MeLiked } from '../like/like';
import { MeFollowed } from '../follow/follow';
import { TotalCounter } from '../product/product';

export interface Member {
	_id: string;
	memberType: MemberType;
	memberStatus: MemberStatus;
	memberAuthType: MemberAuthType;
	memberProvider: MemberProvider;
	memberPhone: string;
	memberEmail: string;
	memberNick: string;
	memberPassword?: string;
	memberFullName?: string;
	memberImage: string;
	memberAddress?: string;
	memberDesc?: string;
	memberProducts: number;
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
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	// Enable for authentications
	meLiked?: MeLiked[];
	meFollowed?: MeFollowed[];
	accessToken?: string;
}

export interface Members {
	list: Member[];
	metaCounter?: TotalCounter[];
}
