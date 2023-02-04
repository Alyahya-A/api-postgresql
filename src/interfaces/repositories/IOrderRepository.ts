import { OrderItem } from '../order';
import { BaseRepository } from './baseRepository';

export interface IOrderRepository<T> extends BaseRepository<T> {
  addItem(item: OrderItem): Promise<OrderItem>;
  isOrderActive(orderId: number): Promise<boolean>;
  getActiveOrder(userId: number): Promise<T | null>;
  getOrderItem(orderId: number, productId: number): Promise<OrderItem>;
  completeOrderByOrderId(orderId: number): Promise<T>;
  completedOrdersByUserId(userId: number): Promise<T[]>;
}
