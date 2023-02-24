import { injectable } from 'inversify';
import { PoolClient, QueryResult } from 'pg';
import Client from '../database';
import { Order, OrderItem } from '../interfaces/order';
import { IOrderRepository } from '../interfaces/repositories/IOrderRepository';

@injectable()
export class OrderRepository implements IOrderRepository<Order> {
  async index(): Promise<Order[]> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      let sql =
        ' SELECT o.id as OrderId, o.user_id as UserId, i.product_id as ProductId, p.price as productprice, i.quantity as Quantity, s.name as StatusDesc, i.id as ItemId ';
      sql += ' FROM orders o ';
      sql += ' JOIN order_item i on o.id = i.order_id ';
      sql += ' JOIN product p on p.id = i.product_id ';
      sql += ' LEFT JOIN lk_status s on o.status_id = s.code ';
      sql += ' order by i.order_id, i.product_id ';

      const { rows } = await connection.query(sql);

      const orders: Order[] = [];

      let prevOrderId = 0;
      let prevProdcutId = 0;

      let orderIndex = -1;
      let productIndex = -1;

      // The output will be:
      // [{"orderid":1,"userid":1,"productid":1,"quantity":1,"statusdesc":"Active","itemid":2}]

      for (const order of rows) {
        // New order
        if (prevOrderId !== order.orderid) {
          orders.push({
            id: order.orderid,
            status: order.statusdesc,
            user_id: order.userid,
            totalAmount: 0,
            products: []
          });

          productIndex = 0;
          orderIndex++;
        }

        // to avoid returning 1 index of empty object in orders.products, if there is no items we must return empty list
        if (order.itemid > 0) {
          // if it's same order & product we will add the quantity to the prev. (So, no duplictaed products in orders.products list)
          if (
            prevOrderId === order.orderid &&
            prevProdcutId === order.productid
          ) {
            orders[orderIndex].products[productIndex - 1].quantity +=
              order.quantity;
          } else {
            orders[orderIndex].products.push({
              id: order.itemid,
              order_id: order.orderid,
              product_id: order.productid,
              quantity: order.quantity
            });

            productIndex++;
          }

          orders[orderIndex].totalAmount += order.productprice * order.quantity;
        }

        prevOrderId = order.orderid;
        prevProdcutId = order.productid;
      }

      return orders;
    } catch (err) {
      throw new Error(`Could not get order with all products. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      let sql =
        ' SELECT o.id as OrderId, o.user_id as UserId, i.product_id as ProductId, p.price as productprice, i.quantity as Quantity, s.name as StatusDesc, i.id as ItemId ';
      sql += ' FROM orders o ';
      sql += ' JOIN order_item i on o.id = i.order_id ';
      sql += ' JOIN product p on p.id = i.product_id ';
      sql += ' LEFT JOIN lk_status s on o.status_id = s.code ';
      sql += ' where o.user_id = $1 ';
      sql += ' order by i.order_id, i.product_id ';

      const { rows } = await connection.query(sql, [userId]);

      const orders: Order[] = [];

      let prevOrderId = 0;
      let prevProdcutId = 0;

      let orderIndex = -1;
      let productIndex = -1;

      // The output will be:
      // [{"orderid":1,"userid":1,"productid":1,"quantity":1,"statusdesc":"Active","itemid":2}]

      for (const order of rows) {
        // New order
        if (prevOrderId !== order.orderid) {
          orders.push({
            id: order.orderid,
            status: order.statusdesc,
            user_id: order.userid,
            totalAmount: 0,
            products: []
          });

          productIndex = 0;
          orderIndex++;
        }

        // to avoid returning 1 index of empty object in orders.products, if there is no items we must return empty list
        if (order.itemid > 0) {
          // if it's same order & product we will add the quantity to the prev. (So, no duplictaed products in orders.products list)
          if (
            prevOrderId === order.orderid &&
            prevProdcutId === order.productid
          ) {
            orders[orderIndex].products[productIndex - 1].quantity +=
              order.quantity;
          } else {
            orders[orderIndex].products.push({
              id: order.itemid,
              order_id: order.orderid,
              product_id: order.productid,
              quantity: order.quantity
            });

            productIndex++;
          }

          orders[orderIndex].totalAmount += order.productprice * order.quantity;
        }

        prevOrderId = order.orderid;
        prevProdcutId = order.productid;
      }

      return orders;
    } catch (err) {
      throw new Error(`Could not get order with all products. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getById(id: number): Promise<Order> {
    let connection: PoolClient | null = null;

    try {
      let sql =
        ' SELECT o.id as OrderId, o.user_id as UserId, i.product_id as ProductId, p.price as ProductPrice, i.quantity as Quantity, s.name as StatusDesc, i.id as ItemId ';
      sql += ' FROM orders o ';
      sql += ' JOIN order_item i on o.id = i.order_id ';
      sql += ' JOIN product p on p.id = i.product_id ';
      sql += ' LEFT JOIN lk_status s on o.status_id = s.code ';
      sql += ' WHERE o.id = $1 ';
      sql += ' order by i.product_id ';

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [id]);

      let order!: Order;

      let prevProdcutId = 0;

      let firstRecord = true;
      let productIndex = 0;

      // The output will be:
      // [{"orderid":1,"userid":1,"productid":1,"quantity":1,"statusdesc":"Active","itemid":2}]

      for (const item of rows) {
        // New order
        if (firstRecord) {
          order = {
            id: item.orderid,
            status: item.statusdesc,
            user_id: item.userid,
            totalAmount: 0,
            products: []
          };

          firstRecord = false;
        }

        // to avoid returning 1 index of empty object in orders.products, if there is no items we must return empty list
        if (item.itemid > 0) {
          // if it's same order & product we will add the quantity to the prev. (So, no duplictaed products in orders.products list)
          if (prevProdcutId === item.productid) {
            order.products[productIndex - 1].quantity += item.quantity;
          } else {
            order.products.push({
              id: item.itemid,
              order_id: item.orderid,
              product_id: item.productid,
              quantity: item.quantity
            });

            productIndex++;
          }

          order.totalAmount += item.productprice * item.quantity;
        }

        prevProdcutId = item.productid;
      }

      return order;
    } catch (err) {
      throw new Error(`Could not get order by id. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getOrderItem(orderId: number, productId: number): Promise<OrderItem> {
    let connection: PoolClient | null = null;

    try {
      const sql: string = `SELECT * FROM order_item WHERE order_id = $1 and product_id = $2`;

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [
        orderId,
        productId
      ]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not get order by id. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async create(order: Order): Promise<Order> {
    let connection: PoolClient | null = null;

    try {
      const { user_id } = order;

      const sql =
        'INSERT INTO orders (user_id, status_id) VALUES($1, $2) RETURNING *';

      connection = await Client.connect();

      // status_id 1 = Active
      const { rows }: QueryResult = await connection.query(sql, [user_id, 1]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async addItem(item: OrderItem): Promise<OrderItem> {
    let connection: PoolClient | null = null;

    try {
      const { product_id, order_id, quantity } = item;

      connection = await Client.connect();

      const sql =
        'INSERT INTO order_item (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';

      const { rows }: QueryResult = await connection.query(sql, [
        order_id,
        product_id,
        quantity
      ]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not add item to order. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async isOrderActive(orderId: number): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();

      const ordersql = 'SELECT * FROM orders WHERE id=$1 ';

      const result = await connection.query(ordersql, [orderId]);

      const order = result.rows[0];

      // not active
      if (order && order.status_id === 1) {
        return true;
      }

      return false;
    } catch (err) {
      throw new Error(`Could check if order active. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getActiveOrder(userId: number): Promise<Order | null> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();

      const ordersql =
        'SELECT * FROM orders WHERE user_id= $1 and status_id = 1';

      const { rowCount, rows } = await connection.query(ordersql, [userId]);

      // has active order
      if (rowCount > 0) {
        return this.getById(rows[0].id);
      }

      return null;
    } catch (err) {
      throw new Error(`Could check user has active order. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async completeOrderByOrderId(orderId: number): Promise<Order> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();

      const ordersql =
        'UPDATE orders set status_id = 2 WHERE id = $1 RETURNING *';

      const { rows } = await connection.query(ordersql, [orderId]);

      return await this.getById(rows[0].id);
    } catch (err) {
      throw new Error(`Could complete the order. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async completedOrdersByUserId(userId: number): Promise<Order[]> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();

      let sql =
        ' SELECT o.id as OrderId, o.user_id as UserId, i.product_id as ProductId, p.price as productprice, i.quantity as Quantity, s.name as StatusDesc, i.id as ItemId ';
      sql += ' FROM orders o ';
      sql += ' JOIN order_item i on o.id = i.order_id ';
      sql += ' JOIN product p on p.id = i.product_id ';
      sql += ' LEFT JOIN lk_status s on o.status_id = s.code ';
      sql += ' WHERE o.user_id = $1 and o.status_id = 2 ';
      sql += ' order by i.order_id, i.product_id ';

      const { rows } = await connection.query(sql, [userId]);

      const orders: Order[] = [];

      let prevOrderId = 0;
      let prevProdcutId = 0;

      let orderIndex = -1;
      let productIndex = -1;

      // The output will be:
      // [{"orderid":1,"userid":1,"productid":1,"quantity":1,"statusdesc":"Active","itemid":2}]

      for (const order of rows) {
        // New order
        if (prevOrderId !== order.orderid) {
          orders.push({
            id: order.orderid,
            status: order.statusdesc,
            user_id: order.userid,
            totalAmount: 0,
            products: []
          });

          productIndex = 0;
          orderIndex++;
        }

        // to avoid returning 1 index of empty object in orders.products, if there is no items we must return empty list
        if (order.itemid > 0) {
          // if it's same order & product we will add the quantity to the prev. (So, no duplictaed products in orders.products list)
          if (
            prevOrderId === order.orderid &&
            prevProdcutId === order.productid
          ) {
            orders[orderIndex].products[productIndex - 1].quantity +=
              order.quantity;
          } else {
            orders[orderIndex].products.push({
              id: order.itemid,
              order_id: order.orderid,
              product_id: order.productid,
              quantity: order.quantity
            });

            productIndex++;
          }

          orders[orderIndex].totalAmount += order.productprice * order.quantity;
        }

        prevOrderId = order.orderid;
        prevProdcutId = order.productid;
      }

      return orders;
    } catch (err) {
      throw new Error(`Could get completed orders by userId. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async exists(id: number): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM orders where id = $1';

      const { rows } = await connection.query(sql, [id]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get order. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async delete(id: number): Promise<Order> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'DELETE FROM orders WHERE id=$1 RETURNING * ';

      const { rows } = await connection.query(sql, [id]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not delete order. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }
}
