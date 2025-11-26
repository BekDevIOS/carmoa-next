import {
	ProductType,
	ProductStatus,
	ProductCondition,
	ProductMainCategory,
	ProductSubCategory,
	CarBrand,
} from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	productType?: ProductType;
	productStatus?: ProductStatus;
	productCondition?: ProductCondition;
	productMainCategory?: ProductMainCategory;
	productSubCategory?: ProductSubCategory;
	productCarBrand?: CarBrand;
	productCarModel?: string;
	productYearFrom?: number;
	productYearTo?: number;
	productOemNumbers?: string[];
	productTitle?: string;
	productPrice?: number;
	productSalePrice?: number;
	productStock?: number;
	productComments?: number;
	productImages?: string[];
	productDescription?: string;
	soldAt?: Date;
	deletedAt?: Date;
}
