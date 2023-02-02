import { Pool } from "pg";
import config from "./config/config";

let Client: Pool;

console.log(`App running in ${config.ENV} environment`);

if (config.ENV === "test") {
  console.log(`Set Client to TEST env`);

  Client = new Pool({
    host: config.PostgresHost,
    database: config.PostgresTestDB,
    user: config.PostgresUser,
    password: config.PostgresPassword
  });
} else {
  // default Dev
  console.log(`Set Client to default env (dev)`);

  Client = new Pool({
    host: config.PostgresHost,
    database: config.PostgresDB,
    user: config.PostgresUser,
    password: config.PostgresPassword
  });
}

export default Client;
