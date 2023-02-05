import { Request } from 'express';
import morgan from 'morgan';

morgan.token('params', (req: Request): string => JSON.stringify(req.query));

const requestLoggerMiddleware = morgan(
  ':method :url | :params | :status | :response-time ms'
);

export default requestLoggerMiddleware;
