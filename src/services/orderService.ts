import { inject, injectable } from "inversify";
import { StatusCode } from "../consts/statusCodes";
import TYPES from "../consts/types";
import { Order, OrderItem } from "../interfaces/order";
import { APIError } from "../models/errors/apiError";
import { OrderRepository } from "../repositories/orderRepository";
import { ProductRepository } from "../repositories/productRepository";

@injectable()
export class OrderService {
  constructor(
    @inject(TYPES.OrderRepository)
    private readonly _orderRepo: OrderRepository,
    @inject(TYPES.ProductRepository)
    private readonly _productRepo: ProductRepository
  ) {}

  public getAllOrders = async (): Promise<Order[]> => {
    return await this._orderRepo.index();
  };

  public async getActiveOrder(userId: number): Promise<Order | null> {
    return await this._orderRepo.getActiveOrder(userId);
  }

  public async createOrder(userId: number): Promise<Order> {
    const order: Order | null = await this._orderRepo.getActiveOrder(userId);

    if (order != null) {
      throw new APIError(
        "Could not create order since user has an active order",
        1000,
        StatusCode.badRequest,
        true
      );
    }

    return await this._orderRepo.create({
      user_id: userId,
      id: 0,
      products: [],
      status: ""
    });
  }

  public async addItemToOrder(order: OrderItem): Promise<OrderItem> {
    if (!(await this._orderRepo.exists(order.order_id))) {
      throw new APIError(
        `Order \"${order.order_id}\" not found`,
        1200,
        StatusCode.badRequest,
        true
      );
    }

    if (!(await this._productRepo.exists(order.product_id))) {
      throw new APIError(
        `Product \"${order.product_id}\" not found`,
        1200,
        StatusCode.badRequest,
        true
      );
    }

    if (order.quantity < 1) {
      throw new APIError(
        `Invalid quantity. Must be more than zero!`,
        1200,
        StatusCode.badRequest,
        true
      );
    }

    if (!(await this._orderRepo.isOrderActive(order.order_id))) {
      throw new APIError(
        `Could not add product ${order.product_id} to order ${order.order_id} because order in not active`,
        1000,
        StatusCode.badRequest,
        true
      );
    }

    return await this._orderRepo.addItem(order);
  }

  public async existsById(id: number): Promise<boolean> {
    return await this._orderRepo.exists(id);
  }

  public async getOrderById(id: number): Promise<Order> {
    return await this._orderRepo.getById(id);
  }

  public async deleteOrder(id: number): Promise<Order> {
    if (!(await this._orderRepo.exists(id))) {
      throw new APIError(
        `Order \"${id}\" is not exists`,
        1201,
        StatusCode.badRequest,
        true
      );
    }

    return await this._orderRepo.delete(id);
  }

  public async completeOrder(orderId: number): Promise<Order> {
    if (!(await this._orderRepo.exists(orderId))) {
      throw new APIError(
        `Order \"${orderId}\" not found`,
        1200,
        StatusCode.badRequest,
        true
      );
    }

    if (!(await this._orderRepo.isOrderActive(orderId))) {
      throw new APIError(
        `Order must be active to complete it`,
        1000,
        StatusCode.badRequest,
        true
      );
    }

    return await this._orderRepo.completeOrderByOrderId(orderId);
  }

  public async completedOrders(userId: number): Promise<Order[]> {
    return await this._orderRepo.completedOrdersByUserId(userId);
  }
}
