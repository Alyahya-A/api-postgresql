import { injectable } from "inversify";
import { StatusCode } from "../consts/statusCodes";
import { User } from "../interfaces/user";
import { APIError } from "../models/errors/apiError";
import { UserRepository } from "../repositories/userRepository";

@injectable()
export class UserService {
  constructor(private readonly _userRepo: UserRepository) {}

  public getAllUser = async (): Promise<User[]> => {
    return await this._userRepo.index();
  };

  public async createUser(body: User): Promise<User> {
    if (await this._userRepo.existsByEmail(body.email)) {
      throw new APIError(
        `Email \"${body.email}\" is already exists`,
        1400,
        StatusCode.badRequest,
        true
      );
    }

    return await this._userRepo.create(body);
  }

  public async getUserById(id: number): Promise<User> {
    return await this._userRepo.getById(id);
  }

  public async deleteUser(id: number): Promise<User> {
    if (!(await this._userRepo.exists(id))) {
      throw new APIError(
        `User \"${id}\" is not exists`,
        1401,
        StatusCode.badRequest,
        true
      );
    }

    return await this._userRepo.delete(id);
  }
}
