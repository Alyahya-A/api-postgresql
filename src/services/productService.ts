import { inject, injectable } from 'inversify';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { Product } from '../interfaces/product';
import { APIError } from '../models/errors/apiError';
import { ProductRepository } from '../repositories/productRepository';
import { CategoryService } from './categoryService';

@injectable()
export class ProductService {
  constructor(
    @inject(TYPES.ProductRepository)
    private readonly _productRepo: ProductRepository,
    @inject(TYPES.CategoryService)
    private readonly _categoryService: CategoryService
  ) {}

  public getAllProducts = async (): Promise<Product[]> => {
    return await this._productRepo.index();
  };

  public async createProduct(body: Product): Promise<Product> {
    if (!(await this._categoryService.existsById(body.category_id))) {
      throw new APIError(
        `Category \"${body.category_id}\" not found. Please add the category first`,
        3200,
        StatusCode.badRequest,
        true
      );
    }

    if (await this._productRepo.existsByName(body.name)) {
      throw new APIError(
        `Product \"${body.name}\" is already exists`,
        3201,
        StatusCode.badRequest,
        true
      );
    }

    return await this._productRepo.create(body);
  }

  public async getProductById(id: number): Promise<Product> {
    return await this._productRepo.getById(id);
  }

  public async deleteProduct(id: number): Promise<Product> {
    if (!(await this._productRepo.exists(id))) {
      throw new APIError(
        `Product \"${id}\" is not exists`,
        3202,
        StatusCode.badRequest,
        true
      );
    }

    return await this._productRepo.delete(id);
  }

  public async getCategoryProducts(categoryId: number): Promise<Product[]> {
    if (!(await this._categoryService.existsById(categoryId))) {
      throw new APIError(
        `Invalid category Id: ${categoryId}`,
        3203,
        StatusCode.badRequest,
        true
      );
    }

    return await this._productRepo.getCategoryProducts(categoryId);
  }
}
