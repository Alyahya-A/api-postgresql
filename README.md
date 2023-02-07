# Storefront Backend Project

## Overview

An API project built with Node.js. It's an e-commerce software built based on the [REQUIREMENTS.md](/REQUIREMENTS.md) file.

Additional Storefront platform built with the best and clear architecture makes it easy to develop custom functionality and follow any business requirements if needed.  
Storefront provides stability, high performance, and security.

## Getting Started

This application is run a node.js and provides REST API endpoints.
To start the application you need to set up and configure your app:

### Database

The API connects to a PostgreSQL database. So, it's necessary to create a database on your local machine called `storefront_backend_dev`.

1. Open `psql` SQL Shell terminal
2. Run the following command

```sql
CREATE DATABASE storefront_backend_dev;
```

### Migration

In Storefront we used `db-migrate` package for database migration. `db-migrate` is a database framework for node.js.  
A migration file contains code and scripts to apply the changes, and code to remove the changes again.

Migrations files can be found under [migrations](./migrations).

`db-migrate` supports the concept of environments. Such as dev, test, and prod environment where you need to run the migrations at different times. Environment configurations are loaded from a `database.json` file. So we need to create `database.json` file (Under the Storefront root folder) like the one shown below:

```json
{
  "dev": {
    "driver": "pg",
    "host": "localhost",
    "port": 5432,
    "database": "storefront_backend_dev",
    "user": "<USERNAME>",
    "password": "<USER_PASSWORD>"
  },
  "test": {
    "driver": "pg",
    "host": "localhost",
    "port": 5432,
    "database": "storefront_backend_test",
    "user": "<USERNAME>",
    "password": "<USER_PASSWORD>"
  },
  "sql-file": true
}
```

**_For demonstration and testing purposes only_**

To run the `migrations` we need to install `db-migrate` globally by the following command:

```bash
npm install -g db-migrate
```

#### Running Migrations:

When first running the migrations, all will be executed in sequence. A table named migrations will also be created in your database to track which migrations have been applied.

So, run the following command to apply the `migrations`:

```bash
npm run db-up # or db-migrate up
```

### Configuration

To run the app you need to create `env` file called `config.env` under [src/config](./src/config/) with the following keys:

| Key               | Value (for demonstration and testing purposes only)                                   |
| ----------------- | ------------------------------------------------------------------------------------- |
| POSTGRES_HOST     | Used to create Database Client. Value `localhost`                                     |
| POSTGRES_PORT     | Database port                                                                         |
| POSTGRES_DB       | storefront_backend_dev                                                                |
| POSTGRES_TEST_DB  | storefront_backend_test                                                               |
| POSTGRES_USER     | `<USERNAME>`                                                                          |
| POSTGRES_PASSWORD | `<USER_PASSWORD>`                                                                     |
| ENV               | dev                                                                                   |
| PORT              | 3000                                                                                  |
| JWT_SECRET        | Secret key. Any text or number you want to add here to create `jwt Token`             |
| SaltRounds        | Controls how much time is needed to calculate a single BCrypt hash. Set value to `10` |

For **_testing purposes_** you can copy the following values for your `config.env`:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=storefront_backend_dev
POSTGRES_TEST_DB=storefront_backend_test
POSTGRES_USER=<USERNAME>
POSTGRES_PASSWORD=<USER_PASSWORD>
ENV=dev
PORT=3000
JWT_SECRET=97D17B58182C4EE9E113E74ABF9E572680D0D898525F2208D7DD191EBFDBF326
SaltRounds=10
```

### Install all dependencies

Finally, to install all packages and dependencies run the following command:

```bash
npm i # or npm install
```

### Scripts

Here you can find the scripts which may help you. You can run one of the following scripts with the following command `npm run <ScriptName>`

| Script Name  | Description                                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| start        | It monitors your project directory and automatically restarts your node application when it detects any changes                                                                                  |
| build        | Creates a build directory named `dist` with a production build of your app                                                                                                                       |
| test         | Set `ENV` to test, run the build script, create a test database called `storefront_backend_test`, runs `migrations --env test`, then run all jasmine spces tests and finally `drop` the database |
| format:check | Check that all files are formatted and match the prettier code style                                                                                                                             |
| format:fix   | This rewrites all processed files and formats files in the current directory                                                                                                                     |
| db-up        | Runs the new `migrations`                                                                                                                                                                        |

## Start App

Now the app is ready to run locally, by bellow command:

`npm run start`

App will run on port `3000` and the database runs on port `5432`

## How to use

### Endpoint Access

All endpoints are defined in [routeInfo](/docs/routeInfo.json) file provided by `inversify-express-utils`.  
Also, a `Postman Collections` added contains all endpoints. [postman_collection](docs/storefront_backend.postman_collection.json)

### Token and Authentication

The client passes the authentication information to the server in an `Authorization` header

```
Authorization   Bearer <token>
```

You can generate a token by the following endpoint:  
`[POST] /api/token ` and pass the body:

```json
{
  "email": "<EMAIL>",
  "password": "<PASSWORD>"
}
```

## Errors & Logging

Storefront handle errors in two different way, and all errors are logged in `.log` file under [logs folder](/logs/) in **Production environment** (errors logged to Console in development environment). You can find more information about log and log configuration in the [logger.ts](/src/logger/logger.ts) file.

In Storefront, all handled errors are built based on [BaseError](/src//models/errors/baseError.ts) model

All possible errors that inherit from `BaseError`:

1. [NoDataFoundError](/src//models/errors/noDataError.ts): When there is no data found in the database a fixed, proper, and handle error will return to the user. See the following example response:

```json
{
  "title": "No data found",
  "httpCode": 404,
  "isOperational": true,
  "errorCode": 4000
}
```

2. [InvalidParamError](/src//models/errors/invalidParamError.ts): If the user sends an invalid parameter value in exception will return as the following example:

```json
{
  "title": "Invalid email address!",
  "httpCode": 400,
  "isOperational": true,
  "errorCode": 5002
}
```

3. [APIError](/src//models/errors/apiError.ts): All handled exceptions in general are all catch or thrown as an `APIError`. For example when we want to validate if the product is already added before we add it to the database:

```json
{
  "title": "Product \"Product 1\" is already exists",
  "httpCode": 400,
  "isOperational": true,
  "errorCode": 3201
}
```

All the above errors are returned to the user as `badRequest (400)`. So, the previous errors are handled and it is considered as a trusted error since all errors are `badRequest` and `isOperational == true`.

Now [exceptionHandlerMiddleware](/src/middlewares/exceptionHandlerMiddleware.ts.ts) cames. This middleware will catch any exceptions within the app, if the error is trusted it will return to the user with its details (such as message, code.. etc). On another hand if the exception is unhandled and occured in any function the middleware will catch it and log the error to `.log` file with the `traceId`, then a generic error will return to the user with the `traceId` like the following:

```json
{
  "title": "Internal server error. Please contact to customer service",
  "httpCode": 500,
  "traceId": "e4caca7c-c4b6-c684-526a-2c7ec79e292b"
}
```

So, in this way we catch all the exceptions that occur in our app within the `exceptionHandlerMiddleware` if the exception is trusted (means it was handled) then return it to the user; otherwise (unhandled exception), log the error and return a generic error to the user (don't return the exception to the user)

### Error codes

You can find all business errors in [ErrorCodes.xlsx](docs/ErrorCodes.xlsx) file.

## Testing

A set of jasmine testing suites and specs can be used to test all code and all functionality including Controllers, Repositories, and Services
Run the following command:

`npm run test`

It sets the environment to `test`, migrates up tables for the test database, runs the test then drops the database.

NOTE: if the test script failed, it will not run to the end. So, to fix that please run this `db-migrate db:drop storefront_backend_test` to remove the database

```

```
