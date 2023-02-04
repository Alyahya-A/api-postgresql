import { BaseEntity } from './baseEntity';

export interface User extends BaseEntity {
  firstname: string;
  lastname: string;
  email: string;
  password_encrypt: string;
}
