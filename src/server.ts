// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
// "reflect-metadata"; must be in di-container.ts to make it accessable for testing
import { container } from './di-container';

// d
import bodyParser from 'body-parser';
import cors from 'cors';
import { InversifyExpressServer } from 'inversify-express-utils';
import { exceptionHandlerMiddleware } from './middlewares/exceptionHandlerMiddleware';
import EndpointNotFound404Middleware from './middlewares/endpointNotFoundMiddleware';
import requestLoggerMiddleware from './middlewares/requestLoggerMiddleware';
import { CustomAuthProvider } from './providers/customAuthProvider';
import { config } from './config/config';

// console.clear();

const server = new InversifyExpressServer(
  container,
  null,
  {
    rootPath: '/api'
  },
  null,
  CustomAuthProvider
);

server.setConfig(app => {
  // Add Logs middlewares
  app.use(requestLoggerMiddleware);

  app.use(cors({ origin: true }));
  app.options('*', cors());
  app.use(bodyParser.json());
});

const app = server.build();
const port: number = config.Port ?? 3001; // Default port

app.use(exceptionHandlerMiddleware);

// Add page not found middleware
app.use(EndpointNotFound404Middleware);

// const routeInfo = getRouteInfo(container);
// console.log(JSON.stringify({ routes: routeInfo }, null, 4));

// Run the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
