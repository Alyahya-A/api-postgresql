import { Pool } from 'pg';
import { config } from './config/config';

let Client: Pool;

Client = new Pool({
  host: config.PostgresHost,
  port: config.PostgresPort,
  database: config.PostgresDB,
  user: config.PostgresUser,
  password: config.PostgresPassword
});

export default Client;
