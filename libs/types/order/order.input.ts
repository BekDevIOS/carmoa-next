import { OrderStatus, PaymentStatus, PaymentMethod } from '../../enums/order.enum';
import { Direction } from '../../enums/common.enum';
import { OrderItemInput } from '../order-item/order-item.input';



export interface OrderInput {
	orderItems: OrderItemInput[];
	paymentMethod?: PaymentMethod;
	paymentStatus?: PaymentStatus;
	notes?: string;
}

interface OISearch {
	orderStatus?: OrderStatus;
	paymentStatus?: PaymentStatus;
	memberId?: string;
	dealerId?: string;
}

export interface OrdersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: OISearch;
}

