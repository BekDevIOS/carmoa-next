import { BoardArticleCategory, BoardArticleStatus } from '../../enums/blog.enum';
import { Member } from '../member/member';

export interface BoardArticle {
	_id: string;
	articleCategory: BoardArticleCategory;
	articleStatus: BoardArticleStatus;
	articleTitle: string;
	articleContent: string;
	articleImage?: string;
	articleViews: number;
	articleLikes: number;
	articleComments: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
	meLiked?: MeLiked[];
}

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}
