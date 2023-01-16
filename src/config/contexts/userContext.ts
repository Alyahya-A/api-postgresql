import { injectable } from "inversify";
import { User } from "../../interfaces/user";

@injectable()
export class UserContext {
  private user!: User;

  public setUser(user: User) {
    this.user = user;
  }

  public getEmail(): string {
    return this.user?.email;
  }
}
