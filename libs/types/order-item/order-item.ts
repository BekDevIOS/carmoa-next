import { OrderItemStatus } from "../../enums/order.enum";
import { Member } from "../member/member";
import { Product } from "../product/product";

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: string;
  dealerId: string;
  itemQuantity: number;
  itemPrice: number;
  itemStatus: OrderItemStatus;
  createdAt: string;
  updatedAt: string;
  
  // Populated fields (optional)
  productData?: Product;
  dealerData?: Member;
}