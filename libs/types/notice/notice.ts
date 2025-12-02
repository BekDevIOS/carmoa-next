import { NoticeStatus, NoticeVisibleTo } from '../../enums/notice.enum';

// Single Notice item
export interface Notice {
	_id: string;
	title: string;
	content: string;
	visibleTo: NoticeVisibleTo;
	status: NoticeStatus;
	createdAt: Date;
	updatedAt: Date;
}

// Notice list response (for admin)
export interface Notices {
	list: Notice[];
	metaCounter: Array<{
		total: number;
	}>;
}

