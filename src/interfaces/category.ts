import { BaseEntity } from './baseEntity';

export interface Category extends BaseEntity {
  name: string;
  description: string;
}
