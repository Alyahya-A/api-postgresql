import { StatusCode } from '../../consts/statusCodes';
import { BaseError } from './baseError';

export class NoDataFoundError extends BaseError {
  public readonly errorCode: number;

  constructor() {
    super('No data found', StatusCode.notFound, '', true);
    this.errorCode = 4000;
  }
}
