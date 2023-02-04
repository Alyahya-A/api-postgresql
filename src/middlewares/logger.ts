import express from 'express';
import { Guid } from 'guid-typescript';
import { StatusCode } from '../consts/statusCodes';
import { errorHandler } from '../models/errors/errorHandler';

export const loggerMiddleware = async (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let traceId = Guid.create();

  req.headers['x-trace-id'] = traceId.toString();

  await errorHandler.handleError(req, traceId, err);

  if (errorHandler.isTrustedError(err)) {
    res
      .status(StatusCode.badRequest)
      .json({ ...err, traceId: traceId.toString() });
  } else {
    res.status(StatusCode.internalServer).json({
      title: `Internal server error. Please contact to customer service`,
      httpCode: 500,
      traceId: traceId.toString(),
    });
  }
};
