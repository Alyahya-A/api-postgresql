import { Request, Response } from 'express';

const EndpointNotFound404Middleware = (req: Request, res: Response): void => {
  res.status(404);
  res.json('Endpoint not found');
};

export default EndpointNotFound404Middleware;
