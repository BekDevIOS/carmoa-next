import {
	CarBrand,
	ProductCondition,
	ProductMainCategory,
	ProductStatus,
	ProductSubCategory,
	ProductType,
} from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';

export interface ProductInput {
	productType?: ProductType;
	productStatus?: ProductStatus;
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
	productStock?: number;
	productImages: string[];
	productDescription?: string;
	dealerId: string;
}

export interface PISearch {
	memberId?: string;
	brandList?: CarBrand[];
	mainCategoryList?: ProductMainCategory[];
	subCategoryList?: ProductSubCategory[];
	conditionList?: ProductCondition[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	yearsRange?: Range;
	text?: string;
	onSale?: boolean;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface DPISearch {
	productStatus?: ProductStatus;
}

export interface DealerProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: DPISearch;
}

interface APISearch {
	productStatus?: ProductStatus;
}

export interface AgentProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

export interface ALPISearch {
	productStatus?: ProductStatus;
	carBrandList?: CarBrand[];
	productMainCategoryList?: ProductMainCategory[];
	productSubCategoryList?: ProductSubCategory[];
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}

export interface OrdinaryInquiry {
	page: number;
	limit: number;
}
