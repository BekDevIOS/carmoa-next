import { NoticeStatus, NoticeVisibleTo } from '../../enums/notice.enum';

// Input for updating Notice (admin)
export interface NoticeUpdate {
	_id: string;
	title?: string;
	content?: string;
	visibleTo?: NoticeVisibleTo;
	status?: NoticeStatus;
}

