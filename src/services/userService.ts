import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { User } from '../interfaces/user';
import { TokenReqDto } from '../models/dto/tokenDto';
import { UserDto } from '../models/dto/userDto';
import { APIError } from '../models/errors/apiError';
import { UserRepository } from '../repositories/userRepository';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private readonly _userRepo: UserRepository
  ) {}

  public getAllUser = async (): Promise<UserDto[]> => {
    const users: UserDto[] = [];

    for (const user of await this._userRepo.index()) {
      users.push({
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email
      });
    }

    return users;
  };

  public async createUser(body: User): Promise<UserDto> {
    if (await this._userRepo.existsByEmail(body.email)) {
      throw new APIError(
        `${body.email} email is already exists`,
        5200,
        StatusCode.badRequest,
        true
      );
    }

    const user: User = await this._userRepo.create(body);

    return {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email
    };
  }

  public async getUserById(id: number): Promise<UserDto> {
    const user: User = await this._userRepo.getById(id);

    return {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email
    };
  }

  public async getUserByEmail(email: string): Promise<User> {
    return await this._userRepo.getByEmail(email);
  }

  public async existsByEmail(email: string): Promise<boolean> {
    return await this._userRepo.existsByEmail(email);
  }

  public async deleteUser(id: number): Promise<UserDto> {
    if (!(await this._userRepo.exists(id))) {
      throw new APIError(
        `User \"${id}\" is not exists`,
        5201,
        StatusCode.badRequest,
        true
      );
    }

    const user: User = await this._userRepo.delete(id);

    return {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email
    };
  }

  public async generateToken(user: TokenReqDto): Promise<string> {
    if (!(await this._userRepo.existsByUser(user))) {
      throw new APIError(
        `Incorrect email or password`,
        5202,
        StatusCode.badRequest,
        true
      );
    }

    return jwt.sign(
      { email: user.email, claims: 'user', issuedAt: new Date() },
      config.Secret,
      {
        expiresIn: '1d'
      }
    );
  }
}
