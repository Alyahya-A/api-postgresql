import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpPost,
  requestBody
} from 'inversify-express-utils';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { User } from '../interfaces/user';
import { TokenReqDto } from '../models/dto/tokenDto';
import { InvalidParamError } from '../models/errors/invalidParamError';
import { UserService } from '../services/userService';
import { emailValidator } from '../utils/emailValidator';

@controller('/token')
export class TokenController extends BaseHttpController {
  constructor(
    @inject(TYPES.UserService) private readonly _userService: UserService
  ) {
    super();
  }

  // Generate token
  @httpPost('/')
  async generateToken(@requestBody() req: TokenReqDto) {
    if (!emailValidator(req.email)) {
      return this.json(
        new InvalidParamError('Invalid email address!', 6000),
        StatusCode.badRequest
      );
    }

    if (!req.password || req.password.length < 8) {
      return this.json(
        new InvalidParamError(
          'Invalid password!. Password length must be 8 or more',
          6001
        ),
        StatusCode.badRequest
      );
    }

    const token: string = await this._userService.generateToken(req);

    const user: User = await this._userService.getUserByEmail(req.email);

    const userRes = {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      token: token
    };

    return this.json(userRes, StatusCode.created);
  }
}
