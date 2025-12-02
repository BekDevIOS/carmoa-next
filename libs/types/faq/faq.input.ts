import { FAQCategory, FAQStatus } from '../../enums/faq.enum';
import { Direction } from '../../enums/common.enum';

// Input for creating FAQ (admin)
export interface FaqInput {
	category: FAQCategory;
	question: string;
	answer: string;
	status?: FAQStatus;
}

// Search filter for admin list
export interface FaqInquirySearch {
	category?: FAQCategory;
	status?: FAQStatus;
	text?: string;
}

// Input for admin list query with pagination
export interface FaqInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FaqInquirySearch;
}

