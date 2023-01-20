import express from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
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
import { Category } from "../interfaces/category";
import { Product } from "../interfaces/product";
import { errorHandler } from "../models/errors/errorHandler";
import { InvalidParamError } from "../models/errors/invalidParamError";
import { NoDataFoundError } from "../models/errors/noDataError";
import { CategoryService } from "../services/categoryService";
import { ProductService } from "../services/productService";

@controller("/categories")
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
  @httpGet("/")
  async index(
    @request() _: express.Request,
    @response() res: express.Response
  ) {
    const allCategories: Category[] =
      await this._categoryService.getAllCategories();

    if (allCategories.length == 0) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(allCategories);
  }

  //  Get category by id
  @httpGet("/:id")
  async getCategoryById(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const category = await this._categoryService.getCategoryById(id);

    if (!category) {
      return res.status(StatusCode.notFound).json(new NoDataFoundError());
    }

    return res.status(StatusCode.ok).json(category);
  }

  // Create category
  @httpPost("/", TYPES.AuthMiddleware)
  async create(
    @requestBody() req: Category,
    @response() res: express.Response
  ) {
    if (!req.name) {
      return res
        .status(StatusCode.badRequest)
        .json(new InvalidParamError("Invalid category name!", 2000));
    }

    try {
      const created: Category = await this._categoryService.createCategory(req);
      return res.status(StatusCode.created).json(created);
    } catch (error) {
      errorHandler.throw(res, error);
    }
  }

  // Delete category
  @httpDelete("/:id", TYPES.AuthMiddleware)
  async deleteCategory(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const category = await this._categoryService.deleteCategory(id);

    if (!category) {
      return res.status(StatusCode.badRequest).json();
    }

    return res.status(StatusCode.ok).json(category);
  }

  //  Get products by category Id
  @httpGet("/:categoryId/products")
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
