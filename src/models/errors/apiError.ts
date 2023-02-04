import { StatusCode } from '../../consts/statusCodes';
import { BaseError } from './baseError';

export class APIError extends BaseError {
  public readonly errorCode: number;

  constructor(
    name: string,
    errorCode: number,
    httpCode = StatusCode.badRequest,
    isOperational = true,
    description = 'Bad Request 400'
  ) {
    super(name, httpCode, description, isOperational);
    this.errorCode = errorCode;
  }
}
