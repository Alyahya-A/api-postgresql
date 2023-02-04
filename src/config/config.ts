import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';
import path from 'path';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface Config {
  Port: number | undefined;
  PostgresHost: string | undefined;
  PostgresDB: string | undefined;
  PostgresTestDB: string | undefined;
  PostgresUser: string | undefined;
  PostgresPassword: string | undefined;
  ENV: string | undefined;
  Secret: Secret;
  SaltRounds: number | undefined;
}

// Loading process.env as ENV interface

const getConfig = (): Config => {
  return {
    Port: process.env.PORT ? Number(process.env.PORT) : undefined,
    PostgresHost: process.env.POSTGRES_HOST,
    PostgresDB: process.env.POSTGRES_DB,
    PostgresTestDB: process.env.POSTGRES_TEST_DB,
    PostgresUser: process.env.POSTGRES_USER,
    PostgresPassword: process.env.POSTGRES_PASSWORD,
    ENV: process.env.ENV?.toString().trim().toLowerCase(),
    Secret: process.env.JWT_SECRET as Secret,
    SaltRounds: process.env.SaltRounds
      ? Number(process.env.SaltRounds)
      : undefined
  };
};

const config = getConfig();

export const isDevEnvironment = () => config.ENV === 'dev';

export default config;
