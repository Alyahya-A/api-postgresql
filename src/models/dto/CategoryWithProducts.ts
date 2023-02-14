import { Product } from '../../interfaces/product';

export class CategoryWithProducts {
  categoryId: number;
  categoryName: string;
  products: Product[];

  constructor(categoryId: number, categoryName: string, products: Product[]) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.products = products;
  }
}
