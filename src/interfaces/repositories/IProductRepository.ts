import { Product } from '../product';
import { BaseRepository } from './baseRepository';

export interface IProductRepository<T> extends BaseRepository<T> {
  existsByName(name: string): Promise<boolean>;
  getCategoryProducts(categoryId: number): Promise<Product[]>;
}
