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
import { InvalidParamError } from "../models/errors/InvalidParamError";
import { NoDataFoundError } from "../models/errors/noDataError";
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
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
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
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(status);
  }

  // Create user
  @httpPost("/")
  async create(@requestBody() req: User, @response() res: express.Response) {
    if (!req.firstName) {
      return res
        .status(StatusCode.badRequest)
        .json(new InvalidParamError("Invalid first name!", 2300));
    }

    if (!req.lastName) {
      return res
        .status(StatusCode.badRequest)
        .json(new InvalidParamError("Invalid last name!", 2301));
    }

    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!req.email || expression.test(req.email)) {
      return res
        .status(StatusCode.badRequest)
        .json(new InvalidParamError("Invalid email!", 2302));
    }

    if (!req.password_encrypt || req.password_encrypt.length < 8) {
      return res
        .status(StatusCode.badRequest)
        .json(
          new InvalidParamError(
            "Invalid password!. Password length must be 8 or more",
            2303
          )
        );
    }

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
