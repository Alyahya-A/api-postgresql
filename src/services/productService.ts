import { injectable } from "inversify";
import { StatusCode } from "../consts/statusCodes";
import { Product } from "../interfaces/product";
import { APIError } from "../models/errors/apiError";
import { ProductRepository } from "../repositories/productRepository";
import { CategoryService } from "./categoryService";

@injectable()
export class ProductService {
  constructor(
    private readonly _productRepo: ProductRepository,
    private readonly _categoryService: CategoryService
  ) {}

  public getAllProducts = async (): Promise<Product[]> => {
    return await this._productRepo.index();
  };

  public async createProduct(body: Product): Promise<Product> {
    if (!(await this._categoryService.existsById(body.category_id))) {
      throw new APIError(
        `Category \"${body.category_id}\" not found. Please add the category first`,
        1000,
        StatusCode.badRequest,
        true
      );
    }

    if (await this._productRepo.existsByName(body.name)) {
      throw new APIError(
        `Product \"${body.name}\" is already exists`,
        1001,
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
        1002,
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
        1003,
        StatusCode.badRequest,
        true
      );
    }

    return await this._productRepo.getCategoryProducts(categoryId);
  }
}
