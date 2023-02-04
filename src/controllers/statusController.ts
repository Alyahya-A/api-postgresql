import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  requestBody,
  requestParam
} from 'inversify-express-utils';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { LkStatus } from '../interfaces/lkStatus';
import { InvalidParamError } from '../models/errors/invalidParamError';
import { NoDataFoundError } from '../models/errors/noDataError';
import { StatusService } from '../services/statusService';

@controller('/status')
export class StatusController extends BaseHttpController {
  constructor(
    @inject(TYPES.StatusService) private readonly _statusService: StatusService
  ) {
    super();
  }

  // Get all status
  @httpGet('/')
  async index() {
    const allStatus: LkStatus[] = await this._statusService.getAllStatus();

    if (allStatus.length == 0) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(allStatus, StatusCode.ok);
  }

  //  Get status by id
  @httpGet('/:id')
  async getProductById(@requestParam('id') id: number) {
    const status: LkStatus = await this._statusService.getStstusById(id);

    if (!status) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(status, StatusCode.ok);
  }

  // Create status
  @httpPost('/', TYPES.AuthMiddleware)
  async create(@requestBody() req: LkStatus) {
    if (!req.name) {
      return this.json(
        new InvalidParamError('Invalid Status name!', 4000),
        StatusCode.badRequest
      );
    }

    const created: LkStatus = await this._statusService.createStaus(req);

    return this.json(created, StatusCode.created);
  }

  // Delete status
  @httpDelete('/:id', TYPES.AuthMiddleware)
  async deleteProduct(@requestParam('id') id: number) {
    const status: LkStatus = await this._statusService.deleteStatus(id);

    return this.json(status, StatusCode.ok);
  }
}
