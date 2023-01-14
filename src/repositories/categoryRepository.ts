import { injectable } from "inversify";
import { PoolClient, QueryResult } from "pg";
import Client from "../database";
import { BaseRepository } from "../interfaces/baseRepository";
import { Category } from "../interfaces/category";

@injectable()
export class CategoryRepository implements BaseRepository<Category> {
  async index(): Promise<Category[]> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = "SELECT * FROM category";

      const { rows } = await connection.query(sql);

      return rows;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  getById(id: number): Promise<Category> {
    throw new Error("Method not implemented.");
  }
  async create(t: Category): Promise<Category> {
    let connection: PoolClient | null = null;

    try {
      const { name, description } = t;

      const sql: string = `INSERT INTO category (name, description) VALUES($1, $2) RETURNING *`;

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [
        name,
        description
      ]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not create category. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async exists(id: number): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = "SELECT * FROM category where id = $1";

      const { rows } = await connection.query(sql, [id]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get category. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
