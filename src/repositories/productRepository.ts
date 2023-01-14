import { injectable } from "inversify";
import { PoolClient, QueryResult } from "pg";
import Client from "../database";
import { Product } from "../interfaces/product";
import { IProductRepository } from "../interfaces/repositories/IProductRepository";

@injectable()
export class ProductRepository implements IProductRepository<Product> {
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

  async exists(id: number): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = "SELECT * FROM product where id = $1";

      const { rows } = await connection.query(sql, [id]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get category. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async existsByName(name: string): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = "SELECT * FROM product where name = $1";

      const { rows } = await connection.query(sql, [name]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get category. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async delete(id: number): Promise<Product> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = "DELETE FROM product WHERE id=$1 RETURNING * ";

      const { rows } = await connection.query(sql, [id]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not get category. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getCategoryProducts(categoryId: number): Promise<Product[]> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = "SELECT * FROM product where category_id=$1";

      const { rows } = await connection.query(sql, [categoryId]);

      return rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }
}
