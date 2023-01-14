import express from "express";

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
import { Category } from "../interfaces/category";
import { errorHandler } from "../models/errors/errorHandler";
import { InvalidParamError } from "../models/errors/InvalidParamError";
import { NoDataFoundError } from "../models/errors/noDataError";
import { CategoryService } from "../services/categoryService";

@controller("/categories")
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

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
  @httpPost("/")
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
  @httpDelete("/:id")
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
}
