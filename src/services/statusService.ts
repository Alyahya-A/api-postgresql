import { inject, injectable } from 'inversify';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { LkStatus } from '../interfaces/lkStatus';
import { APIError } from '../models/errors/apiError';
import { StatusRepository } from '../repositories/statusRepository';

@injectable()
export class StatusService {
  constructor(
    @inject(TYPES.StatusRepository)
    private readonly _statusRepo: StatusRepository
  ) {}

  public getAllStatus = async (): Promise<LkStatus[]> => {
    return await this._statusRepo.index();
  };

  public async createStaus(body: LkStatus): Promise<LkStatus> {
    if (await this._statusRepo.existsByName(body.name)) {
      throw new APIError(
        `Staus name \"${body.name}\" is already exists`,
        4200,
        StatusCode.badRequest,
        true
      );
    }

    if (await this._statusRepo.existsByCode(body.code)) {
      throw new APIError(
        `Staus code \"${body.code}\" is already exists`,
        4201,
        StatusCode.badRequest,
        true
      );
    }

    return await this._statusRepo.create(body);
  }

  public async getStstusById(id: number): Promise<LkStatus> {
    return await this._statusRepo.getById(id);
  }

  public async deleteStatus(id: number): Promise<LkStatus> {
    if (!(await this._statusRepo.exists(id))) {
      throw new APIError(
        `Status \"${id}\" is not exists`,
        4202,
        StatusCode.badRequest,
        true
      );
    }

    return await this._statusRepo.delete(id);
  }
}
