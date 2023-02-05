import express from 'express';
import { Guid } from 'guid-typescript';
import { StatusCode } from '../consts/statusCodes';
import { errorHandler } from '../utils/errorHandler';

export const exceptionHandlerMiddleware = async (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let traceId = Guid.create();

  req.headers['x-trace-id'] = traceId.toString();

  if (errorHandler.isTrustedError(err)) {
    res.status(StatusCode.badRequest).json(err);
  } else {
    // Only log unhandled errors
    await errorHandler.logError(req, traceId, err);

    res.status(StatusCode.internalServer).json({
      title: `Internal server error. Please contact to customer service`,
      httpCode: 500,
      traceId: traceId.toString()
    });
  }
};
