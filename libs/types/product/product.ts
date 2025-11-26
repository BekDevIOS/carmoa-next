import {
	ProductType,
	ProductStatus,
	ProductCondition,
	ProductMainCategory,
	ProductSubCategory,
	CarBrand,
} from '../../enums/product.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface Product {
	_id: string;
	productType: ProductType;
	productStatus: ProductStatus;
	productCondition: ProductCondition;
	productMainCategory: ProductMainCategory;
	productSubCategory: ProductSubCategory;
	productCarBrand: CarBrand;
	productCarModel: string;
	productYearFrom: number;
	productYearTo: number;
	productOemNumbers?: string[];
	productTitle: string;
	productPrice: number;
	productSalePrice?: number;
	productStock: number;
	productViews: number;
	productLikes: number;
	productComments: number;
	productRank: number;
	productImages: string[];
	productDescription?: string;
	dealerId: string;
	soldAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface TotalCounter {
	total: number;
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter[];
}
