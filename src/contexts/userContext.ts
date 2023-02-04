import { injectable } from 'inversify';
import { User } from '../interfaces/user';

@injectable()
export class UserContext {
  private user!: User;

  public setUser(user: User) {
    this.user = user;
  }

  public getId(): number {
    return this.user.id!;
  }

  public getEmail(): string {
    return this.user?.email;
  }
}
