import { StatusCode } from '../../consts/statusCodes';
import { BaseError } from './baseError';

export class InvalidParamError extends BaseError {
  public readonly errorCode: number;

  constructor(title: string, errorCode: number) {
    super(title, StatusCode.badRequest, '', true);
    this.errorCode = errorCode;
  }
}
