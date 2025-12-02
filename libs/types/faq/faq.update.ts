import { FAQCategory, FAQStatus } from '../../enums/faq.enum';

// Input for updating FAQ (admin)
export interface FaqUpdate {
	_id: string;
	category?: FAQCategory;
	question?: string;
	answer?: string;
	status?: FAQStatus;
}

