import { StatusCode } from "../../consts/statusCodes";
import { BaseError } from "./baseError";

export class APIError extends BaseError {
  public readonly errorCode: number;

  constructor(
    name: string,
    httpCode = StatusCode.internalServer,
    errorCode: number,
    isOperational = true,
    description = "Internal server error"
  ) {
    super(name, httpCode, description, isOperational);
    this.errorCode = errorCode;
  }
}
