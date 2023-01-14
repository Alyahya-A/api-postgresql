//reflect-metadata should be imported before any interface or other imports
//also it should be imported only once, so that a singleton is created.
import "reflect-metadata";

import { InversifyExpressServer } from "inversify-express-utils";
import EndpointNotFound404Middleware from "./middlewares/pageNotFound404";
import requestLoggerMiddleware from "./middlewares/requestLogger";

import express from "express";

import config from "./config/config";
import { container } from "./di-container";
import { loggerMiddleware } from "./middlewares/logger";

// Controllers
import "./controllers/categoryController";
import "./controllers/productController";

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

// Run the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
