import express from "express";

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
import { User } from "../interfaces/user";
import { NotDataFoundError } from "../models/errors/notDataError";
import { UserService } from "../services/userService";

@controller("/users")
export class UserController {
  constructor(private readonly _statusService: UserService) {}

  // Get all users
  @httpGet("/")
  async index(
    @request() _: express.Request,
    @response() res: express.Response
  ) {
    const allUser: User[] = await this._statusService.getAllUser();

    if (allUser.length == 0) {
      return res.status(StatusCode.notFound).json(new NotDataFoundError());
    }

    return res.status(StatusCode.ok).json(allUser);
  }

  //  Get user by id
  @httpGet("/:id")
  async getProductById(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const user: User = await this._statusService.getUserById(id);

    if (!user) {
      return res.status(StatusCode.notFound).json(new NotDataFoundError());
    }

    return res.status(StatusCode.ok).json(status);
  }

  // Create user
  @httpPost("/")
  async create(@requestBody() req: User, @response() res: express.Response) {
    const created: User = await this._statusService.createUser(req);
    return res.status(StatusCode.created).json(created);
  }

  // Delete user
  @httpDelete("/:id")
  async deleteProduct(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const user: User = await this._statusService.deleteUser(id);

    if (!user) {
      return res.status(StatusCode.badRequest).json();
    }

    return res.status(StatusCode.ok).json(status);
  }
}
