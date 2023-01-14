import { BaseEntity } from "./baseEntity";
import { LkStatus } from "./lkStatus";

export interface Order extends BaseEntity {
  products: OrderItem[];
  user_id: number;
  status: LkStatus;
}

export interface OrderItem extends BaseEntity {
  product_id: number;
  quantity: number;
}
