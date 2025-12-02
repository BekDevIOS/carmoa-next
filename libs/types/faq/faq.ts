import { FAQCategory, FAQStatus } from '../../enums/faq.enum';

// Single FAQ item
export interface Faq {
	_id: string;
	category: FAQCategory;
	question: string;
	answer: string;
	status: FAQStatus;
	createdAt: Date;
	updatedAt: Date;
}

// FAQ list response (for admin)
export interface Faqs {
	list: Faq[];
	metaCounter: Array<{
		total: number;
	}>;
}

