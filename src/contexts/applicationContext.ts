import { injectable } from 'inversify';

@injectable()
export class ApplicationContext {
  private accessToken!: string;

  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  public getAccessToken() {
    return this.accessToken;
  }
}
