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
    if (!this._categoryService.existsById(body.category_id)) {
      throw new APIError("Category not found", 4100, StatusCode.notFound, true);
    }

    return await this._productRepo.create(body);
  }

  public async getProductById(id: number): Promise<Product> {
    console.log(`getProductById ${id}`);
    return await this._productRepo.getById(id);
  }
}
