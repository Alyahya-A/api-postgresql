// export const orderEndpoint: Router = Router();
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam
} from 'inversify-express-utils';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { UserContext } from '../contexts/userContext';
import { Order, OrderItem } from '../interfaces/order';
import { PlaceOrderReq } from '../models/dto/placeOrderReq';
import { APIError } from '../models/errors/apiError';
import { NoDataFoundError } from '../models/errors/noDataError';
import { OrderService } from '../services/orderService';

@controller('/orders', TYPES.AuthMiddleware)
export class OrderController extends BaseHttpController {
  constructor(
    @inject(TYPES.OrderService)
    private readonly _orderService: OrderService,
    @inject(TYPES.UserContext)
    private readonly _userContext: UserContext
  ) {
    super();
  }

  // Get all orders
  @httpGet('/')
  async index() {
    const allOrders: Order[] = await this._orderService.getAllOrdersByUserId(
      this._userContext.getId()
    );

    if (allOrders.length == 0) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(allOrders, StatusCode.ok);
  }

  // Completed order by user
  @httpGet('/completed')
  async completedOrderByUser() {
    const orders: Order[] = await this._orderService.completedOrders(
      this._userContext.getId()
    );

    if (!orders || orders.length == 0) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(orders, StatusCode.ok);
  }

  // Completed order by user
  @httpGet('/active')
  async getActiveOrder() {
    console.log(`userId: ${this._userContext.getId()}`);

    const order: Order | null = await this._orderService.getActiveOrder(
      this._userContext.getId()
    );

    if (!order) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(order, StatusCode.ok);
  }

  //  Get order by id
  @httpGet('/:id')
  async getOrderById(@requestParam('id') id: number) {
    const order: Order = await this._orderService.getOrderById(id);

    if (!order) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(order, StatusCode.ok);
  }

  // Create order
  @httpPost('/')
  async create() {
    const created: Order = await this._orderService.createOrder(
      this._userContext.getId()
    );

    return this.json(created, StatusCode.created);
  }

  // Place order with all products items
  @httpPost('/place')
  async placeOrder(@requestBody() req: PlaceOrderReq) {
    const created: Order = await this._orderService.placeOrder(
      req,
      this._userContext.getId()
    );

    return this.json(created, StatusCode.created);
  }

  // Delete order
  @httpDelete('/:id')
  async deleteOrder(@requestParam('id') id: number) {
    const order: Order = await this._orderService.deleteOrder(id);

    return this.json(order, StatusCode.ok);
  }

  // Add item/product to active order
  @httpPost('/:orderId/products')
  async addItemToOrder(
    @requestParam('orderId') orderId: number,
    @requestBody() req: OrderItem
  ) {
    req.order_id = orderId;
    const orderItem: OrderItem = await this._orderService.addItemToOrder(req);

    return this.json(orderItem, StatusCode.ok);
  }

  // Complete order
  @httpPut('/:orderId/complete')
  async completeOrder(@requestParam('orderId') orderId: number) {
    const order: Order = await this._orderService.completeOrder(orderId);

    if (!order) {
      throw new APIError(
        `Could not complete order: ${orderId}`,
        1000,
        StatusCode.badRequest,
        true
      );
    }

    return this.json(order, StatusCode.ok);
  }
}
