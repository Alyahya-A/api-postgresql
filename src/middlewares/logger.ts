import express from "express";
import { StatusCode } from "../consts/statusCodes";
import { errorHandler } from "../models/errors/errorHandler";
import { v4 as uuidv4 } from "uuid";

export const loggerMiddleware = async (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(`I'm in error middleware`);

  let traceUuid = uuidv4();

  await errorHandler.handleError(req, traceUuid, err);

  if (errorHandler.isTrustedError(err)) {
    res.status(StatusCode.badRequest).json({ ...err, traceId: traceUuid });
  } else {
    res.status(StatusCode.internalServer).json({
      title: `Internal server error. Please contact to customer service`,
      traceId: traceUuid
    });
  }
};
