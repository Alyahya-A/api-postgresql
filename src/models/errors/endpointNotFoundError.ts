import { StatusCode } from '../../consts/statusCodes';
import { BaseError } from './baseError';

export class EndpointNotFoundError extends BaseError {
  public readonly errorCode: number;

  constructor() {
    super('Endpoint not found', StatusCode.notFound, '', true);
    this.errorCode = 4004;
  }
}
