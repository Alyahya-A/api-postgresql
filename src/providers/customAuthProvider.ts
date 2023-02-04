import express from 'express';
import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import TYPES from '../consts/types';
import { ApplicationContext } from '../contexts/applicationContext';
import { UserContext } from '../contexts/userContext';
import { container } from '../di-container';
import { TokenResDto } from '../models/dto/tokenDto';
import { UserService } from '../services/userService';
import { verifyToken } from '../utils/verifyToken';
import { Principal } from './principal';

const userService = inject(TYPES.UserService);

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {
  @userService
  private readonly _userService!: UserService;

  public async getUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<interfaces.Principal> {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      try {
        const tokenRes: TokenResDto = verifyToken(token);
        const user = await this._userService.getUserByEmail(tokenRes.email);

        // Set user context
        container.get<UserContext>(TYPES.UserContext).setUser(user);

        // Set token to App context
        container
          .get<ApplicationContext>(TYPES.ApplicationContext)
          .setAccessToken(token);

        const principal = new Principal(user);
        return principal;
      } catch (error) {
        return new Principal();
      }
    } else return new Principal();
  }
}
