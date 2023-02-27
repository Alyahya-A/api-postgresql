import { Request, Response } from 'express';
import { EndpointNotFoundError } from '../models/errors/endpointNotFoundError';

const EndpointNotFound404Middleware = (req: Request, res: Response): void => {
  res.status(404);
  res.json(new EndpointNotFoundError());
};

export default EndpointNotFound404Middleware;
