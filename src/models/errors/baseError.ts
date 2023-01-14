import { StatusCode } from "../../consts/statusCodes";

export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: StatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: StatusCode,
    description: string,
    isOperational: boolean
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
