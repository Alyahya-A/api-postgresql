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
import { emailValidator } from "../utils/emailValidator";

@controller("/token")
export class TokenController extends BaseHttpController {
  constructor(
    @inject(TYPES.UserService) private readonly _tokenService: UserService
  ) {
    super();
  }

  // Generate token
  @httpPost("/")
  async generateToken(@requestBody() req: TokenReqDto) {
    if (!emailValidator(req.email)) {
      return this.json(
        new InvalidParamError("Invalid email address!", 6000),
        StatusCode.badRequest
      );
    }

    if (!req.password || req.password.length < 8) {
      return this.json(
        new InvalidParamError(
          "Invalid password!. Password length must be 8 or more",
          6001
        ),
        StatusCode.badRequest
      );
    }

    const token: string = await this._tokenService.generateToken(req);

    return this.json(token, StatusCode.created);
  }
}
