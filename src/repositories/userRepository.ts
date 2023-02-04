import { injectable } from 'inversify';
import { PoolClient, QueryResult } from 'pg';
import Client from '../database';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { User } from '../interfaces/user';
import { TokenReqDto } from '../models/dto/tokenDto';
import { comparePassword, encryptPassword } from '../utils/bcrypt';

@injectable()
export class UserRepository implements IUserRepository<User> {
  async index(): Promise<User[]> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM users';

      const { rows } = await connection.query(sql);

      return rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getById(id: number): Promise<User> {
    let connection: PoolClient | null = null;

    try {
      const sql: string = `SELECT * FROM users WHERE id = $1`;

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [id]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not get user by id. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }
  async create(t: User): Promise<User> {
    let connection: PoolClient | null = null;

    try {
      const { firstname, lastname, email, password_encrypt } = t;

      const sql: string = `INSERT INTO users (firstName, lastName, email, password_encrypt) VALUES($1, $2, $3, $4) RETURNING *`;

      connection = await Client.connect();

      const { rows }: QueryResult = await connection.query(sql, [
        firstname,
        lastname,
        email,
        encryptPassword(password_encrypt)
      ]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not create user. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async exists(id: number): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM users where id = $1';

      const { rows } = await connection.query(sql, [id]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get user. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async delete(id: number): Promise<User> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=$1 RETURNING * ';

      const { rows } = await connection.query(sql, [id]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not delete user. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async getByEmail(email: string): Promise<User> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM users where email = $1';

      const { rows } = await connection.query(sql, [email]);

      return rows[0];
    } catch (err) {
      throw new Error(`Could not get user. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }
  async existsByEmail(email: string): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      connection = await Client.connect();
      const sql = 'SELECT * FROM users where email = $1';

      const { rows } = await connection.query(sql, [email]);

      if (rows.length > 0) return true;
      else return false;
    } catch (err) {
      throw new Error(`Could not get user. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }

  async existsByUser(user: TokenReqDto): Promise<boolean> {
    let connection: PoolClient | null = null;

    try {
      const { email, password } = user;

      connection = await Client.connect();
      const sql = 'SELECT * FROM users where email = $1 ';

      const { rows } = await connection.query(sql, [email]);

      if (rows.length > 0) {
        const userDb: User = rows[0];

        return comparePassword(userDb.password_encrypt, user.password);
      } else return false;
    } catch (err) {
      throw new Error(`Could not get user. Error: ${err}`);
    } finally {
      connection?.release();
    }
  }
}
