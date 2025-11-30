import { OrderStatus, PaymentStatus, PaymentMethod } from '../../enums/order.enum';
import { Direction } from '../../enums/common.enum';

export interface OrderItemInput {
	productId: string;
	itemQuantity: number;
	itemPrice: number;
}

export interface OrderInput {
	orderItems: OrderItemInput[];
	dealerId: string;
	paymentMethod?: PaymentMethod;
	paymentStatus?: PaymentStatus;
	notes?: string;
}

interface OISearch {
	orderStatus?: OrderStatus;
}

export interface OrdersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: OISearch;
}

