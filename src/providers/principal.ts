import { interfaces } from 'inversify-express-utils';
import { User } from '../interfaces/user';

export class Principal implements interfaces.Principal {
  public details: User | undefined;

  public constructor(details?: User) {
    if (details) this.details = details;
  }

  public isAuthenticated(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public isResourceOwner(resourceId: unknown): Promise<boolean> {
    return Promise.resolve(resourceId === 1111);
  }

  public isInRole(role: string): Promise<boolean> {
    return Promise.resolve(role === 'admin');
  }
}
