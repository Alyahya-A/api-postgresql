import express from "express";

import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  request,
  requestParam,
  response
} from "inversify-express-utils";
import { StatusCode } from "../consts/statusCodes";
import { LkStatus } from "../interfaces/lkStatus";
import { NotDataFoundError } from "../models/errors/notDataError";
import { StatusService } from "../services/StatusService";

@controller("/status")
export class StatusController {
  constructor(private readonly _statusService: StatusService) {}

  // Get all status
  @httpGet("/")
  async index(
    @request() _: express.Request,
    @response() res: express.Response
  ) {
    const allStatus: LkStatus[] = await this._statusService.getAllStatus();

    if (allStatus.length == 0) {
      return res.status(StatusCode.notFound).json(new NotDataFoundError());
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
      return res.status(StatusCode.notFound).json(new NotDataFoundError());
    }

    return res.status(StatusCode.ok).json(status);
  }

  // Create status
  @httpPost("/")
  async create(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const created: LkStatus = await this._statusService.createStaus(req.body);
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
