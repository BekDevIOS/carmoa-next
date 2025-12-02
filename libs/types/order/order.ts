import { Product } from '../product/product';
import { Member } from '../member/member';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../../enums/order.enum';

export interface OrderItem {
	_id: string;
	orderId: string;
	productId: string;
	itemQuantity: number;
	itemPrice: number;
	createdAt: Date;
	updatedAt: Date;
	
	product?: Product;
}

export interface Order {
	_id: string;
	memberId: string;
	dealerId: string;
	orderStatus: OrderStatus;
	paymentStatus: PaymentStatus;
	paymentMethod: PaymentMethod;
	totalPrice: number;
	shippingFee?: number;
	notes?: string;
	deliveredAt?: Date;
	cancelledAt?: Date;
	memberData?: Member;
	orderItems?: OrderItem[];
	productData?: Product;
	createdAt: Date;
	updatedAt: Date;
}

export interface TotalCounter {
	total: number;
}

export interface Orders {
	list: Order[];
	metaCounter: TotalCounter[];
}
