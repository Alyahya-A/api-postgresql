import { injectable } from 'inversify';
import { PoolClient, QueryResult } from 'pg';
import Client from '../database';
import { LkStatus } from '../interfaces/lkStatus';
import { IStatusRepository } from '../interfaces/repositories/IStatusRepository';

@injectable()
export class StatusRepository implements IStatusRepository<LkStatus> {
  async index(): Promise<LkStatus[]> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM lk_status';

      const { rows } = await connection.query(sql);

      return rows;
    } catch (err) {
      throw new Error(`Could not get staus. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getById(id: number): Promise<LkStatus> {
    let connection: PoolClient | null = null;

    try {
      const sql: string = `SELECT * FROM lk_status WHERE id = $1`;

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [id]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not get staus by id. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }
  async create(t: LkStatus): Promise<LkStatus> {
    let connection: PoolClient | null = null;

    try {
      const { code, name } = t;

      const sql: string = `INSERT INTO lk_status (code, name) VALUES($1, $2) RETURNING *`;

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [code, name]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not create staus. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async exists(id: number): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM lk_status where id = $1';

      const { rows } = await connection.query(sql, [id]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get staus. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async existsByName(name: string): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM lk_status where name = $1';

      const { rows } = await connection.query(sql, [name]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get staus. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async existsByCode(code: number): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM lk_status where code = $1';

      const { rows } = await connection.query(sql, [code]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get staus. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async delete(id: number): Promise<LkStatus> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'DELETE FROM lk_status WHERE id=$1 RETURNING * ';

      const { rows } = await connection.query(sql, [id]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not delete staus. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }
}
