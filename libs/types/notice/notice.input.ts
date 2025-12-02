import { NoticeStatus, NoticeVisibleTo } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

// Input for creating Notice (admin)
export interface NoticeInput {
	title: string;
	content: string;
	visibleTo?: NoticeVisibleTo;
	status?: NoticeStatus;
}

// Search filter for admin list
export interface NoticeInquirySearch {
	visibleTo?: NoticeVisibleTo;
	status?: NoticeStatus;
	text?: string;
}

// Input for admin list query with pagination
export interface NoticeInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NoticeInquirySearch;
}

