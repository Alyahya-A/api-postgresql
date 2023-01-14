import express from "express";
import { StatusCode } from "../consts/statusCodes";
import { errorHandler } from "../models/errors/errorHandler";

export const loggerMiddleware = async (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(`I'm in error middleware`);

  await errorHandler.handleError(err);

  if (errorHandler.isTrustedError(err)) {
    res.status(StatusCode.badRequest).json(err);
  } else {
    res.status(StatusCode.internalServer).json(err.message);
  }
};
