import express from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  request,
  requestBody,
  requestParam,
  response
} from "inversify-express-utils";
import { StatusCode } from "../consts/statusCodes";
import TYPES from "../consts/types";
import { LkStatus } from "../interfaces/lkStatus";
import { InvalidParamError } from "../models/errors/invalidParamError";
import { NoDataFoundError } from "../models/errors/noDataError";
import { StatusService } from "../services/statusService";

@controller("/status")
export class StatusController {
  constructor(
    @inject(TYPES.StatusService) private readonly _statusService: StatusService
  ) {}

  // Get all status
  @httpGet("/")
  async index(
    @request() _: express.Request,
    @response() res: express.Response
  ) {
    const allStatus: LkStatus[] = await this._statusService.getAllStatus();

    if (allStatus.length == 0) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(allStatus);
  }

  //  Get status by id
  @httpGet("/:id")
  async getProductById(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const status: LkStatus = await this._statusService.getStstusById(id);

    if (!status) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(status);
  }

  // Create status
  @httpPost("/")
  async create(
    @requestBody() req: LkStatus,
    @response() res: express.Response
  ) {
    if (!req.name) {
      return res
        .status(StatusCode.badRequest)
        .json(new InvalidParamError("Invalid Status name!", 2200));
    }

    const created: LkStatus = await this._statusService.createStaus(req);
    return res.status(StatusCode.created).json(created);
  }

  // Delete status
  @httpDelete("/:id")
  async deleteProduct(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const status: LkStatus = await this._statusService.deleteStatus(id);

    if (!status) {
      return res.status(StatusCode.badRequest).json();
    }

    return res.status(StatusCode.ok).json(status);
  }
}
