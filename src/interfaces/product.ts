import { BaseEntity } from "./baseEntity";

export interface Product extends BaseEntity {
  name: string;
  price: number;
  category_id: number;
}
