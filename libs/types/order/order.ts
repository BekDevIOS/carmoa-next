import { Member } from '../member/member';
import { Product } from '../product/product';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../../enums/order.enum';
import { OrderItem } from '../order-item/order-item';



export interface Order {
	_id: string;
	memberId: string;
	orderStatus: OrderStatus;
	paymentStatus: PaymentStatus;
	paymentMethod: PaymentMethod;
	totalPrice: number;
	shippingFee?: number;
	notes?: string;
	deliveredAt?: Date;
	cancelledAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	
	// Populated fields (optional)
	memberData?: Member;
	dealerData?: Member;
	orderItems?: OrderItem[];
	productData?: Product; 
}

export interface TotalCounter {
	total: number;
}

export interface Orders {
	list: Order[];
	metaCounter: TotalCounter[];
}
