import { OrderStatus, PaymentStatus, PaymentMethod } from '../../enums/order.enum';

export interface OrderUpdate {
	_id: string;
	orderStatus?: OrderStatus;
	paymentStatus?: PaymentStatus;
	paymentMethod?: PaymentMethod;
	totalPrice?: number;
	shippingFee?: number;
	notes?: string;
	deliveredAt?: Date;
	cancelledAt?: Date;
}

