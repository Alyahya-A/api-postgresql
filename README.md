# Storefront Backend Project

## Overview

An API project built with Node.js. It's an e-commerce software built based on [REQUIREMENTS.md](/REQUIREMENTS.md) file.

Additional Storefront platform built with best and clear architecture makes it easy to develop custom functionality and follow any business requirements if needed.  
Storefront provides stability, high performance and security.

## Getting Started

This application is run a node.js site provides a REST endpoints.
To start the application you need to setup and configure your app:

### Database

The API connects to a postgres database. So, it's necessary to create a database on your local machine called `storefront_backend_dev`.

1. Open `psql` SQL Shell terminal
2. Run the following command

```sql
CREATE DATABASE storefront_backend_dev;
```

### Migration

In Storefront we used `db-migrate` package for database migration. `db-migrate` it is databse framework for node.js.  
A migration file contains code and scripts to apply the changes, and code to remove the changes again.

Migrations files can be found under [migrations](./migrations).

`db-migrate` supports the concept of environments. Such as dev, test, and prod environment where you need to run the migrations at different times. Environment configuration are loaded from a `database.json` file. So we need to create `database.json` file (Under Storefront root folder) like the one shown below:

```json
{
  "dev": {
    "driver": "pg",
    "host": "localhost",
    "database": "storefront_backend_dev",
    "user": "postgres",
    "password": "Aa@123456"
  },
  "test": {
    "driver": "pg",
    "host": "localhost",
    "database": "storefront_backend_test",
    "user": "postgres",
    "password": "Aa@123456"
  },
  "sql-file": true
}
```

To run our `migrations` we need to install `db-migrate` globally by the following command:

```bash
npm install -g db-migrate
```

#### Running Migrations:

When first running the migrations, all will be executed in sequence. A table named migrations will also be created in your database to track which migrations have been applied.

So, run following command to apply the `migrations`:

```bash
npm run db-up # or db-migrate up
```

### Configuration

To run the app you need to create `env` file called `config.env` under [src/config](./src/config/) with the following keys:

| Key               | Value (for demonstration and testing purposes only)                                   |
| ----------------- | ------------------------------------------------------------------------------------- |
| POSTGRES_HOST     | Used to create Database Client. Value `localhost`                                     |
| POSTGRES_DB       | storefront_backend_dev                                                                |
| POSTGRES_TEST_DB  | storefront_backend_test                                                               |
| POSTGRES_USER     | postgres                                                                              |
| POSTGRES_PASSWORD | `<USER_PASSWORD>`                                                                     |
| ENV               | dev                                                                                   |
| PORT              | 3000                                                                                  |
| JWT_SECRET        | Secret key. Any text or number you want to add here to create `jwt Token`             |
| SaltRounds        | Controls how much time is needed to calculate a single BCrypt hash. Set value to `10` |

For **_testing purposes_** you can copy the following valuse for your `config.env`:

```
POSTGRES_HOST=localhost
POSTGRES_DB=storefront_backend_dev
POSTGRES_TEST_DB=storefront_backend_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=Aa@123456
ENV=dev
PORT=3000
JWT_SECRET=97D17B58182C4EE9E113E74ABF9E572680D0D898525F2208D7DD191EBFDBF326
SaltRounds=10
```

### Install all dependencies

Finaly, to install all packages and dependencies run the following command:

```bash
npm i # or npm install
```

### Scripts

Here you can find the scripts which may help you. You can run one of the following scripts with the following command `npm run <ScriptName>`

| Script Name  | Description                                                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start        | It monitors your project directory and automatically restarts your node application when it detects any changes                                                                           |
| build        | Creates a build directory named `dist` with a production build of your app                                                                                                                |
| test         | Set `ENV` to test, run build script, create test databse called `storefront_backend_test`, runs `migrations --env test`, then runs all jasmine spces tests and finally `drop` the databse |
| format:check | Check that all files formatted and match prettier code style                                                                                                                              |
| format:fix   | This rewrites all processed files and formats files in the current directory                                                                                                              |
| db-up        | Runs the new `migrations`                                                                                                                                                                 |

## Start App

Now the app is ready to run locally, by bellow command:

`npm run start`

## How to use

### Endpoint Access

All endpoints are defined in [routeInfo](routeInfo.json) file provided by `inversify-express-utils`.  
Also, a `Postman Collections` added contains all endpoind. [postman_collection](storefront_backend.postman_collection.json)

### Token and Authentication

Tokens are passed along with the http header as

```
Authorization   Bearer <token>
```

You can generate token by the following endpoint:  
`[POST] /api/token ` and pass the body:

```json
{
  "email": "<EMAIL>",
  "password": "<PASSWORD>"
}
```

## Testing

A set of jasmine testing suites and specs can be used to test all code and all functionality including Controllers, Repositories and Services
Run the following command:

`npm run test`

It sets the environment to `test`, migrates up tables for the test database, run the test then drop the database.

NOTE: if the test script failed, it will not run to the end. So, to fix that please run this `db-migrate db:drop storefront_backend_test` to remove the database
