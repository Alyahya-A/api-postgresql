import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  requestBody,
  requestParam
} from 'inversify-express-utils';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { Category } from '../interfaces/category';
import { Product } from '../interfaces/product';
import { CategoryWithProducts } from '../models/dto/CategoryWithProducts';
import { InvalidParamError } from '../models/errors/invalidParamError';
import { NoDataFoundError } from '../models/errors/noDataError';
import { CategoryService } from '../services/categoryService';
import { ProductService } from '../services/productService';

@controller('/categories')
export class CategoryController extends BaseHttpController {
  constructor(
    @inject(TYPES.CategoryService)
    private readonly _categoryService: CategoryService,
    @inject(TYPES.ProductService)
    private readonly _productService: ProductService
  ) {
    super();
  }

  // Get all categories
  @httpGet('/')
  async index() {
    const allCategories: Category[] =
      await this._categoryService.getAllCategories();

    if (allCategories.length == 0) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(allCategories, StatusCode.ok);
  }

    //  Get all categories with its products
    @httpGet('/products')
    async GetAllCategoriesWithProducts() {
      const categories: Category[] =
        await this._categoryService.getAllCategories();
  
      const categoriesRes: CategoryWithProducts[] = [];
  
      for (const categoty of categories) {
        const products: Product[] =
          await this._productService.getCategoryProducts(categoty.id!);
  
        const categoryRes: CategoryWithProducts = new CategoryWithProducts(
          categoty.id!,
          categoty.name,
          products
        );
  
        categoriesRes.push(categoryRes);
      }
  
      if (categoriesRes?.length == 0) {
        return this.json(new NoDataFoundError(), StatusCode.notFound);
      }
  
      return this.json(categoriesRes, StatusCode.ok);
    }

  //  Get category by id
  @httpGet('/:id')
  async getCategoryById(@requestParam('id') id: number) {
    const category = await this._categoryService.getCategoryById(id);

    if (!category) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(category, StatusCode.ok);
  }

  // Create category
  @httpPost('/', TYPES.AuthMiddleware)
  async create(@requestBody() req: Category) {
    if (!req.name) {
      return this.json(
        new InvalidParamError('Invalid category name!', 1000),
        StatusCode.badRequest
      );
    }

    const created: Category = await this._categoryService.createCategory(req);

    return this.json(created, StatusCode.created);
  }

  // Delete category
  @httpDelete('/:id', TYPES.AuthMiddleware)
  async deleteCategory(@requestParam('id') id: number) {
    const category = await this._categoryService.deleteCategory(id);

    return this.json(category, StatusCode.ok);
  }

  //  Get products by category Id
  @httpGet('/:categoryId/products')
  async getCategoryProducts(@requestParam('categoryId') id: number) {
    const products: Product[] = await this._productService.getCategoryProducts(
      id
    );

    if (products?.length == 0) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(products, StatusCode.ok);
  }


}
