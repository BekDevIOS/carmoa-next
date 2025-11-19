import { BoardArticleCategory, BoardArticleStatus } from '../../enums/blog.enum';

export interface BoardArticleUpdate {
	_id: string;
	articleCategory?: BoardArticleCategory;
	articleStatus?: BoardArticleStatus;
	articleTitle?: string;
	articleContent?: string;
	articleImage?: string;
}
