import { BoardArticleCategory, BoardArticleStatus } from '../../enums/blog.enum';
import { Direction } from '../../enums/common.enum';

export interface BoardArticleInput {
	articleCategory: BoardArticleCategory;
	articleTitle: string;
	articleContent: string;
	articleImage?: string;
}

export interface BoardArticlesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: {
		articleCategory?: BoardArticleCategory;
		text?: string;
		memberId?: string;
	};
}

interface AIBSearch {
	memberId?: string;
	text?: string;
}

export interface AllBoardArticlesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AIBSearch;
}
