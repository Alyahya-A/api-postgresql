import { injectable } from "inversify";
import { PoolClient, QueryResult } from "pg";
import Client from "../database";
import { BaseRepository } from "../interfaces/baseRepository";
import { Product } from "../interfaces/product";

@injectable()
export class ProductRepository implements BaseRepository<Product> {
  async index(): Promise<Product[]> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = "SELECT * FROM product";

      const { rows } = await connection.query(sql);

      return rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getById(id: number): Promise<Product> {
    let connection: PoolClient | null = null;

    try {
      const sql: string = `SELECT * FROM product WHERE id = $1`;

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [id]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not get product by id. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }
  async create(t: Product): Promise<Product> {
    let connection: PoolClient | null = null;

    try {
      const { name, price, category_id } = t;

      const sql: string = `INSERT INTO product (name, price, category_id) VALUES($1, $2, $3) RETURNING *`;

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [
        name,
        price,
        category_id
      ]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not create product. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  exists(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
