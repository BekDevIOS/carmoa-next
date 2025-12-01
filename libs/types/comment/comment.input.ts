import { CommentGroup } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';

export interface CommentInput {
	commentGroup: CommentGroup;
	commentContent: string;
	commentRefId: string;
	memberId?: string;
	rating?: number | null;
}

interface CISearch {
	commentRefId: string;
}

export interface CommentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: CISearch;
}
