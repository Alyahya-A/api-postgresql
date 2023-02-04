import { BaseEntity } from './baseEntity';

export interface Product extends BaseEntity {
  name: string;
  price: string;
  category_id: number;
}
