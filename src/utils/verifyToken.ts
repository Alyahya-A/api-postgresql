import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { TokenResDto } from '../models/dto/tokenDto';

export const verifyToken = (token: string): TokenResDto => {
  const decoded = jwt.verify(token, config.Secret) as TokenResDto;
  return decoded;
};
