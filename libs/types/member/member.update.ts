import { MemberStatus, MemberType } from '../../enums/member.enum';
import { MemberShippingAddress, MemberBillingAddress } from './member';

export interface MemberUpdate {
	_id: string;
	memberType?: MemberType;
	memberStatus?: MemberStatus;
	memberPhone?: string;
	memberNick?: string;
	memberPassword?: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberShippingAddress?: MemberShippingAddress;
	memberBillingAddress?: MemberBillingAddress;
	memberEmail?: string;
	memberDesc?: string;
	deletedAt?: Date;
}

export interface AdminMemberUpdate {
	_id: string;
	memberType?: MemberType;
	memberStatus?: MemberStatus;
	memberPhone?: string;
	memberNick?: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberShippingAddress?: MemberShippingAddress;
	memberBillingAddress?: MemberBillingAddress;
	memberDesc?: string;
	deletedAt?: Date;
}
