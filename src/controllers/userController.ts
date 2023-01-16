import express from "express";
import { inject } from "inversify";

import {
  BaseHttpController,
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
import { User } from "../interfaces/user";
import {
  CreateUserReqDto,
  CreateUserResDto
} from "../models/dto/createUserDto";
import { TokenReqDto } from "../models/dto/tokenDto";
import { InvalidParamError } from "../models/errors/invalidParamError";
import { NoDataFoundError } from "../models/errors/noDataError";
import { UserService } from "../services/userService";
import { encryptPassword } from "../utils/bcrypt";

@controller("/users", TYPES.AuthMiddleware)
export class UserController extends BaseHttpController {
  constructor(
    @inject(TYPES.UserService) private readonly _userService: UserService
  ) {
    super();
  }

  // Get all users
  @httpGet("/")
  async index(
    @request() _: express.Request,
    @response() res: express.Response
  ) {
    console.log(`userrr ${this.httpContext.user}`);
    const allUser: User[] = await this._userService.getAllUser();

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
    const user: User = await this._userService.getUserById(id);

    if (!user) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(user);
  }

  // Create user
  @httpPost("/")
  async create(
    @requestBody() req: CreateUserReqDto,
    @response() res: express.Response
  ) {
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

    if (!req.password || req.password.length < 8) {
      return res
        .status(StatusCode.badRequest)
        .json(
          new InvalidParamError(
            "Invalid password!. Password length must be 8 or more",
            2303
          )
        );
    }

    const user: User = {
      firstname: req.firstName,
      lastname: req.lastName,
      email: req.email,
      password_encrypt: encryptPassword(req.password),
      id: 0
    };

    const created: User = await this._userService.createUser(user);

    const token: string = await this._userService.generateToken(
      new TokenReqDto(req.email, req.password)
    );

    const userRes: CreateUserResDto = {
      id: created.id,
      firstName: created.firstname,
      lastName: created.lastname,
      email: created.email,
      token: token
    };

    return res.status(StatusCode.created).json(userRes);
  }

  // Delete user
  @httpDelete("/:id")
  async deleteProduct(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const user: User = await this._userService.deleteUser(id);

    if (!user) {
      return res.status(StatusCode.badRequest).json();
    }

    const userRes = {
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email
    };

    return res.status(StatusCode.ok).json(userRes);
  }
}
