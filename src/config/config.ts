import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';
import path from 'path';

// Parsing the env file.
dotenv.config({
  path: path.resolve(
    __dirname,
    `../config/config.${process.env.NODE_ENV?.trim()}.env`
  )
});

console.log(`App running in ${process.env.NODE_ENV?.trim()} environment`);
console.log(`loaging config based on NODE_ENV`);

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface Config {
  Port: number;
  PostgresHost: string;
  PostgresPort: number;
  PostgresDB: string;
  PostgresTestDB: string;
  PostgresUser: string;
  PostgresPassword: string;
  // ENV: string;
  Secret: Secret;
  SaltRounds: number;
}

// Loading process.env as ENV interface

const getConfig = (): Config => {
  return {
    Port: Number(process.env.PORT),
    PostgresHost: process.env.POSTGRES_HOST!,
    PostgresPort: Number(process.env.POSTGRES_PORT),
    PostgresDB: process.env.POSTGRES_DB!,
    PostgresTestDB: process.env.POSTGRES_TEST_DB!,
    PostgresUser: process.env.POSTGRES_USER!,
    PostgresPassword: process.env.POSTGRES_PASSWORD!,
    // ENV: process.env.ENV!.toString().trim().toLowerCase(),
    Secret: process.env.JWT_SECRET as Secret,
    SaltRounds: Number(process.env.SaltRounds)
  };
};

export const config = getConfig();

export const isDevEnvironment = () =>
  process.env.NODE_ENV?.trim() === 'development';
