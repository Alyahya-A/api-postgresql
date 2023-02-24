import { StatusCode } from '../../consts/statusCodes';
import { BaseError } from './baseError';

export class UnauthorizedError extends BaseError {
  public readonly errorCode: number;

  constructor() {
    super('unauthorized', StatusCode.unauthorized, '', true);
    this.errorCode = 4001;
  }
}
