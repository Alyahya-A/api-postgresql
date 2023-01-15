export class TokenReqDto {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class TokenResDto {
  email: string;
  claims: string[];
  iat: number;
  exp: number;

  constructor(email: string, claims: string[], iat: number, exp: number) {
    this.email = email;
    this.claims = claims;
    this.iat = iat;
    this.exp = exp;
  }
}
