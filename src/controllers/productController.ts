// export const productEndpoint: Router = Router();
import express from "express";
import { inject } from "inversify";

import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  request,
  requestBody,
  requestParam,
  response
} from "inversify-express-utils";
import { StatusCode } from "../consts/statusCodes";
import TYPES from "../consts/types";
import { Product } from "../interfaces/product";
import { InvalidParamError } from "../models/errors/invalidParamError";
import { NoDataFoundError } from "../models/errors/noDataError";
import { ProductService } from "../services/productService";

@controller("/products")
export class ProductController {
  constructor(
    @inject(TYPES.ProductService)
    private readonly _productService: ProductService
  ) {}

  // Get all products
  @httpGet("/")
  async index(
    @request() _: express.Request,
    @response() res: express.Response
  ) {
    const allProducts: Product[] = await this._productService.getAllProducts();

    if (allProducts.length == 0) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(allProducts);
  }

  //  Get product by id
  @httpGet("/:id")
  async getProductById(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const product: Product = await this._productService.getProductById(id);

    if (!product) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(product);
  }

  // Create product
  @httpPost("/", TYPES.AuthMiddleware)
  async create(@requestBody() req: Product, @response() res: express.Response) {
    if (!req.name) {
      return res
        .status(StatusCode.badRequest)
        .json(new InvalidParamError("Invalid product name!", 2100));
    }

    if (!req.price || req.price < 0) {
      return res
        .status(StatusCode.badRequest)
        .json(new InvalidParamError("Invalid product price!", 2101));
    }

    const created: Product = await this._productService.createProduct(req);
    return res.status(StatusCode.created).json(created);
  }

  // Delete product
  @httpDelete("/:id")
  async deleteProduct(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const product: Product = await this._productService.deleteProduct(id);

    if (!product) {
      return res.status(StatusCode.badRequest).json();
    }

    return res.status(StatusCode.ok).json(product);
  }

  //  Get products by category Id
  @httpGet("/category/:categoryId")
  async getCategoryProducts(
    @requestParam("categoryId") id: number,
    @response() res: express.Response
  ) {
    const products: Product[] = await this._productService.getCategoryProducts(
      id
    );

    if (products?.length == 0) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(products);
  }
}
