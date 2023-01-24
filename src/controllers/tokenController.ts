import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  requestBody
} from "inversify-express-utils";
import { StatusCode } from "../consts/statusCodes";
import TYPES from "../consts/types";
import { TokenReqDto } from "../models/dto/tokenDto";
import { InvalidParamError } from "../models/errors/invalidParamError";
import { UserService } from "../services/userService";

@controller("/token")
export class TokenController extends BaseHttpController {
  constructor(
    @inject(TYPES.UserService) private readonly _statusService: UserService
  ) {
    super();
  }

  // Generate token
  @httpPost("/")
  async generateToken(@requestBody() req: TokenReqDto) {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!req.email || expression.test(req.email)) {
      return this.json(
        new InvalidParamError("Invalid email!", 2302),
        StatusCode.badRequest
      );
    }
    this.httpContext;
    if (!req.password || req.password.length < 8) {
      return this.json(
        new InvalidParamError(
          "Invalid password!. Password length must be 8 or more",
          2303
        ),
        StatusCode.badRequest
      );
    }

    const token: string = await this._statusService.generateToken(req);

    return this.json(token, StatusCode.created);
  }
}
