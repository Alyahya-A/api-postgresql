import { Pool } from "pg";
import config from "./config/config";

let Client: Pool;

console.log(`App running in ${config.ENV} environment`);

if (config.ENV === "test") {
  Client = new Pool({
    host: config.PostgresHost,
    database: config.PostgresTestDB,
    user: config.PostgresUser,
    password: config.PostgresPassword
  });
} else {
  // default Dev
  Client = new Pool({
    host: config.PostgresHost,
    database: config.PostgresDB,
    user: config.PostgresUser,
    password: config.PostgresPassword
  });
}

export default Client;
