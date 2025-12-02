import { OrderItemStatus } from "../../enums/order.enum";

export interface OrderItemUpdate {
  orderItemId: string;
  itemStatus: OrderItemStatus;
}

export interface DealerOrderItemUpdate {
  orderItemId: string;
  itemStatus: OrderItemStatus;
}