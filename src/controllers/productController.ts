// export const productEndpoint: Router = Router();
import express from "express";

import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  request,
  requestParam,
  response
} from "inversify-express-utils";
import { StatusCode } from "../consts/statusCodes";
import { Product } from "../interfaces/product";
import { NotDataFoundError } from "../models/errors/notDataError";
import { ProductService } from "../services/productService";

@controller("/products")
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  // Get all products
  @httpGet("/")
  async index(
    @request() _: express.Request,
    @response() res: express.Response
  ) {
    const allProducts: Product[] = await this._productService.getAllProducts();

    if (!allProducts) {
      return res.status(StatusCode.notFound).json(new NotDataFoundError());
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
      return res.status(StatusCode.notFound).json(new NotDataFoundError());
    }

    return res.status(StatusCode.ok).json(product);
  }

  // Create product
  @httpPost("/")
  async create(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const created: Product = await this._productService.createProduct(req.body);
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
      return res.status(StatusCode.notFound).json(new NotDataFoundError());
    }

    return res.status(StatusCode.ok).json(products);
  }
}
