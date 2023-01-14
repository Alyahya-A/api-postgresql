import express from "express";
import { Guid } from "guid-typescript";
import { StatusCode } from "../../consts/statusCodes";
import { logger } from "../../logger/logger";
import { APIError } from "./apiError";
import { BaseError } from "./baseError";

class ErrorHandler {
  public async handleError(
    req: express.Request,
    traceId: Guid,
    err: Error
  ): Promise<void> {
    var body = {
      traceId: traceId.toString(),
      body: req.body
    };

    logger.error(JSON.stringify(body), err);
  }

  public isTrustedError(error: Error) {
    if (
      error instanceof BaseError &&
      error.httpCode !== StatusCode.internalServer
    ) {
      return error.isOperational;
    }
    return false;
  }

  public throw(res: express.Response, error: unknown) {
    if (
      error instanceof APIError &&
      error.httpCode !== StatusCode.internalServer
    ) {
      return res.status(StatusCode.badRequest).json(error);
    }

    return res.status(StatusCode.internalServer).json(error);
  }
}
export const errorHandler = new ErrorHandler();
