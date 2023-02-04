// export const productEndpoint: Router = Router();
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
import { Product } from '../interfaces/product';
import { InvalidParamError } from '../models/errors/invalidParamError';
import { NoDataFoundError } from '../models/errors/noDataError';
import { ProductService } from '../services/productService';

@controller('/products')
export class ProductController extends BaseHttpController {
  constructor(
    @inject(TYPES.ProductService)
    private readonly _productService: ProductService
  ) {
    super();
  }

  // Get all products
  @httpGet('/')
  async index() {
    const allProducts: Product[] = await this._productService.getAllProducts();

    if (allProducts.length == 0) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(allProducts, StatusCode.ok);
  }

  //  Get product by id
  @httpGet('/:id')
  async getProductById(@requestParam('id') id: number) {
    const product: Product = await this._productService.getProductById(id);

    if (!product) {
      return this.json(new NoDataFoundError(), StatusCode.notFound);
    }

    return this.json(product, StatusCode.ok);
  }

  // Create product
  @httpPost('/', TYPES.AuthMiddleware)
  async create(@requestBody() req: Product) {
    if (!req.name) {
      return this.json(
        new InvalidParamError('Invalid product name!', 3000),
        StatusCode.badRequest
      );
    }

    if (!req.price || Number.parseFloat(req.price) < 0) {
      return this.json(
        new InvalidParamError('Invalid product price!', 3001),
        StatusCode.badRequest
      );
    }

    const created: Product = await this._productService.createProduct(req);

    return this.json(created, StatusCode.created);
  }

  // Delete product
  @httpDelete('/:id', TYPES.AuthMiddleware)
  async deleteProduct(@requestParam('id') id: number) {
    const product: Product = await this._productService.deleteProduct(id);

    return this.json(product, StatusCode.ok);
  }
}
