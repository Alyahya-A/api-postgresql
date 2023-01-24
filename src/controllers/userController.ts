import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  requestBody,
  requestParam
} from "inversify-express-utils";
import PasswordValidator from "password-validator";
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
import { emailValidator } from "../utils/emailValidator";

@controller("/users")
export class UserController extends BaseHttpController {
  private readonly schema: PasswordValidator;

  constructor(
    @inject(TYPES.UserService) private readonly _userService: UserService
  ) {
    super();

    this.schema = new PasswordValidator();

    // Add properties to it
    this.schema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(100) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .not()
      .spaces(); // Should not have spaces
  }

  // Get all users
  @httpGet("/", TYPES.AuthMiddleware)
  async index() {
    const allUser: User[] = await this._userService.getAllUser();

    if (allUser.length == 0) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(allUser, StatusCode.ok);
  }

  //  Get user by id
  @httpGet("/:id", TYPES.AuthMiddleware)
  async getProductById(@requestParam("id") id: number) {
    const user: User = await this._userService.getUserById(id);

    if (!user) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(user, StatusCode.ok);
  }

  // Create user
  @httpPost("/")
  async create(@requestBody() req: CreateUserReqDto) {
    if (!req.firstName) {
      return this.json(
        new InvalidParamError("Invalid first name!", 2300),
        StatusCode.badRequest
      );
    }

    if (!req.lastName) {
      return this.json(
        new InvalidParamError("Invalid first name!", 2300),
        StatusCode.badRequest
      );
    }

    if (!emailValidator(req.email)) {
      return this.json(
        new InvalidParamError("Invalid email address", 2302),
        StatusCode.badRequest
      );
    }

    if (!this.schema.validate(req.password)) {
      return this.json(
        new InvalidParamError(
          "Invalid password!. Password length must be 8 or more, have uppercase letters and have lowercase letters",
          2303
        ),
        StatusCode.badRequest
      );
    }

    const user: User = {
      firstname: req.firstName,
      lastname: req.lastName,
      email: req.email,
      password_encrypt: req.password,
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

    return this.json(userRes, StatusCode.created);
  }

  // Delete user
  @httpDelete("/:id", TYPES.AuthMiddleware)
  async deleteProduct(@requestParam("id") id: number) {
    const user: User = await this._userService.deleteUser(id);

    const userRes = {
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email
    };

    return this.json(userRes, StatusCode.ok);
  }
}
