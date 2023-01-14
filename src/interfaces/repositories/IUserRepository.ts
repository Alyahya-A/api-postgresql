import { BaseRepository } from "./baseRepository";

export interface IUserRepository<T> extends BaseRepository<T> {
  getByEmail(email: string): Promise<T>;
  existsByEmail(email: string): Promise<boolean>;
}
