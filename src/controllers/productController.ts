// export const productEndpoint: Router = Router();
import express from "express";

import {
  controller,
  httpGet,
  httpPost,
  request,
  requestParam,
  response
} from "inversify-express-utils";
import { StatusCode } from "../consts/statusCodes";
import { Product } from "../interfaces/product";
import { APIError } from "../models/errors/apiError";
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
    // throw new APIError(
    //   "unhaaaaaaaaaaaaaaaaaandel",
    //   4100,
    //   StatusCode.internalServer
    // );
    throw new Error("Heree unhaaaaaaaaaaaaaaaaaandel");
    const allProducts: Product[] = await this._productService.getAllProducts();

    if (!allProducts) {
      return res.status(StatusCode.notFound).json();
    }

    return res.status(StatusCode.ok).json(allProducts);
  }

  //  Get product by id
  @httpGet("/:id")
  async getProductById(
    @requestParam("id") id: number,
    @response() res: express.Response
  ) {
    const product = await this._productService.getProductById(id);

    if (!product) {
      return res.status(StatusCode.notFound).json();
    }

    return res.status(StatusCode.ok).json(product);
  }

  // Create product
  @httpPost("/")
  async create(@request() req: Product, @response() res: express.Response) {
    console.log(req);
    try {
      const created: Product = await this._productService.createProduct(req);
      return res.status(StatusCode.created).json(created);
    } catch (error) {
      return res.status(StatusCode.badRequest).json(error);
    }
  }
}

// // Get product by id
// // ProductController.get("/:id", async (req: Request, res: Response) => {
// //   const productId: number = parseInt(req.params.id);
// //   const productById: ProductType = await product.getProductById(productId);
// //   return res.json(productById);
// // });
// // // Get products by category
// // ProductController.get("/cat/:category", async (req: Request, res: Response) => {
// //   const category: string = String(req.params.category);
// //   const productByCat: ProductType[] = await product.getProductByCat(category);
// //   return res.json(productByCat);
// // });

// // // Delete product by id
// // ProductController.delete(
// //   "/:id",
// //   authToken,
// //   async (req: Request, res: Response) => {
// //     const id: number = parseInt(req.params.id);
// //     const deletedOrder = await product.deleteProduct(id);
// //     return res.json(deletedOrder);
// //   }
// // );
