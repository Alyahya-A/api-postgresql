//reflect-metadata should be imported before any interface or other imports
//also it should be imported only once, so that a singleton is created.
import "reflect-metadata";

import { InversifyExpressServer } from "inversify-express-utils";
import requestLoggerMiddleware from "./middlewares/requestLogger";
import EndpointNotFound404Middleware from "./middlewares/pageNotFound404";

import express from "express";

import config from "./config/config";
import "./controllers/productController";
import { container } from "./di-container";
import { errorHandler } from "./models/errors/errorHandler";
import { loggerMiddleware } from "./middlewares/logger";

console.clear();

const server = new InversifyExpressServer(container, null, {
  rootPath: "/api"
});

server.setConfig((app) => {
  // Add Logs middlewares
  app.use(requestLoggerMiddleware);
  app.use(express.json());
});

const app = server.build();
const port: number = config.Port ?? 3001; // Default port

app.use(loggerMiddleware);

// Add page not found middleware
app.use(EndpointNotFound404Middleware);

process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  console.log(`I'm in unhandledRejection`);
  throw reason;
});

process.on("uncaughtException", (error: Error) => {
  console.log(`I'm in uncaughtException`);
  // errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

// Run the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
