import { injectable, inject } from "inversify";
import { interfaces } from "inversify-express-utils";

export class Principal<T> implements interfaces.Principal {
  public details: T;
  public constructor(details: T) {
    console.log(`Principal ${JSON.stringify(details)}`);
    this.details = details;
  }
  public isAuthenticated(): Promise<boolean> {
    console.log(`isAuthenticated `);

    return Promise.resolve(true);
  }
  public isResourceOwner(resourceId: unknown): Promise<boolean> {
    return Promise.resolve(resourceId === 1111);
  }
  public isInRole(role: string): Promise<boolean> {
    return Promise.resolve(role === "admin");
  }
}
