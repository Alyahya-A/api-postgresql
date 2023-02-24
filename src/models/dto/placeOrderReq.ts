import { OrderItem } from '../../interfaces/order';

export class PlaceOrderReq {
  products: OrderItem[];

  constructor() {
    this.products = [];
  }
}
