import express from "express";
import { inject, injectable } from "inversify";
import { interfaces } from "inversify-express-utils";
import { User } from "../interfaces/user";
import { TokenResDto } from "../models/dto/tokenDto";
import { UserService } from "../services/userService";
import { verifyToken } from "../utils/verifyToken";
import { Principal } from "./principal";

const userService = inject(UserService);

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {
  @userService
  private readonly _userService!: UserService;

  public async getUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<interfaces.Principal> {
    console.log("CustomAuthProvider");

    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      try {
        const tokenRes: TokenResDto = verifyToken(token);
        const user = await this._userService.getUserByEmail(tokenRes.email);

        const principal = new Principal<User>(user);
        return principal;
      } catch (error) {
        return new Principal({});
      }
    } else return new Principal({});
  }
}
