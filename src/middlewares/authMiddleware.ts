import express from "express";
import { StatusCode } from "../consts/statusCodes";
import { TokenResDto } from "../models/dto/tokenDto";
import { UserService } from "../services/userService";
import { verifyToken } from "../utils/verifyToken";

export class AuthMiddleware {
  constructor(private readonly _userService: UserService) {}

  async authenticate(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    console.log(`AuthMiddleware -- START`);
    if (!req.headers.authorization) {
      return this.notAuthorized(res);
    }

    const parts = req.headers?.authorization?.split(" ") ?? [];

    if (parts.length !== 2) {
      return this.notAuthorized(res);
    }

    if (parts[0] !== "Bearer") {
      return this.notAuthorized(res);
    }

    const token = parts[1];

    if (!token) {
      return this.notAuthorized(res);
    }

    console.log(`AuthMiddleware token: ${token}`);

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
    res.status(StatusCode.unauthorized).json("Unauthorized");
  }
}
