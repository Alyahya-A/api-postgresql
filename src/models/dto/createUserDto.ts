export class CreateUserReqDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}

export class CreateUserResDto {
  firstName: string;
  lastName: string;
  email: string;
  token: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    token: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.token = token;
  }
}
