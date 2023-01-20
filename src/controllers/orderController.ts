// export const orderEndpoint: Router = Router();
import express from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestBody,
  requestParam,
  response
} from "inversify-express-utils";
import { StatusCode } from "../consts/statusCodes";
import TYPES from "../consts/types";
import { UserContext } from "../contexts/userContext";
import { Order, OrderItem } from "../interfaces/order";
import { APIError } from "../models/errors/apiError";
import { NoDataFoundError } from "../models/errors/noDataError";
import { OrderService } from "../services/orderService";

@controller("/orders", TYPES.AuthMiddleware)
export class OrderController {
  constructor(
    @inject(TYPES.OrderService)
    private readonly _orderService: OrderService,
    @inject(TYPES.UserContext)
    private readonly _userContext: UserContext
  ) {}

  // Get all orders
  @httpGet("/")
  async index(
    @request() _: express.Request,
    @response() res: express.Response
  ) {
    const allOrders: Order[] = await this._orderService.getAllOrders();

    if (allOrders.length == 0) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(allOrders);
  }

  // Completed order by user
  @httpGet("/completed")
  async completedOrderByUser(@response() res: express.Response) {
    const orders: Order[] = await this._orderService.completedOrders(
      this._userContext.getId()
    );

    if (!orders || orders.length == 0) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(orders);
  }

  //  Get order by id
  @httpGet("/:id")
  async getOrderById(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const order: Order = await this._orderService.getOrderById(id);

    if (!order) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(order);
  }

  // Create order
  @httpPost("/")
  async create(@response() res: express.Response) {
    const created: Order = await this._orderService.createOrder(
      this._userContext.getId()
    );
    return res.status(StatusCode.created).json(created);
  }

  // Delete order
  @httpDelete("/:id")
  async deleteOrder(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const order: Order = await this._orderService.deleteOrder(id);

    if (!order) {
      return res.status(StatusCode.badRequest).json();
    }

    return res.status(StatusCode.ok).json(order);
  }

  // Add item/product to active order
  @httpPost("/:orderId/products")
  async addItemToOrder(
    @requestParam("orderId") orderId: number,
    @requestBody() req: OrderItem,
    @response() res: express.Response
  ) {
    req.order_id = orderId;
    const orderItem: OrderItem = await this._orderService.addItemToOrder(req);

    return res.status(StatusCode.ok).json(orderItem);
  }

  // Complete order
  @httpPut("/:orderId/complete")
  async completeOrder(
    @requestParam("orderId") orderId: number,
    @response() res: express.Response
  ) {
    const order: Order = await this._orderService.completeOrder(orderId);

    if (!order) {
      throw new APIError(
        `Could not complete order: ${orderId}`,
        1000,
        StatusCode.badRequest,
        true
      );
    }

    return res.status(StatusCode.ok).json(order);
  }
}
