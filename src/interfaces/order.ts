import { BaseEntity } from "./baseEntity";

export interface Order extends BaseEntity {
  products: OrderItem[];
  user_id: number;
  status: string;
}

export interface OrderItem extends BaseEntity {
  order_id: number;
  product_id: number;
  quantity: number;
}
