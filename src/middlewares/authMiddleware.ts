import express from 'express';
import { inject, injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { TokenResDto } from '../models/dto/tokenDto';
import { UnauthorizedError } from '../models/errors/unauthorizedError';
import { UserService } from '../services/userService';
import { verifyToken } from '../utils/verifyToken';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(
    @inject(TYPES.UserService) private readonly _userService: UserService
  ) {
    super();
  }

  async handler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    if (!req.headers.authorization) {
      return this.notAuthorized(res);
    }

    const parts = req.headers?.authorization?.split(' ') ?? [];

    if (parts.length !== 2) {
      return this.notAuthorized(res);
    }

    if (parts[0] !== 'Bearer') {
      return this.notAuthorized(res);
    }

    const token = parts[1];

    if (!token) {
      return this.notAuthorized(res);
    }

    try {
      const user: TokenResDto = verifyToken(token);

      if (!(await this._userService.existsByEmail(user.email))) {
        return this.notAuthorized(res);
      }

      next();
    } catch (err) {
      return this.notAuthorized(res);
    }
  }

  notAuthorized(res: express.Response) {
    res.status(StatusCode.unauthorized).json(new UnauthorizedError());
  }
}
