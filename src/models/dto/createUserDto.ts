import { BaseEntity } from "../../interfaces/baseEntity";

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

export class CreateUserResDto implements BaseEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    token: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.token = token;
  }
}
