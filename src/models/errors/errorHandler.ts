import { logger } from "../../logger/logger";
import { BaseError } from "./baseError";

class ErrorHandler {
  public async handleError(traceId: string, err: Error): Promise<void> {
    logger.error(traceId, err);
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
export const errorHandler = new ErrorHandler();
