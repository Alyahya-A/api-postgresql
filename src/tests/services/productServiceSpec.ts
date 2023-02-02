// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from "../../di-container";

// Other imports
import { cleanUpMetadata } from "inversify-express-utils";
import TYPES from "../../consts/types";
import { APIError } from "../../models/errors/apiError";
import { ProductService } from "../../services/productService";

describe("Product Service", () => {
  const productService = container.get<ProductService>(TYPES.ProductService);
  let createdProdcutId: number;

  beforeAll(async () => {
    console.log("");
    console.log("==========================");
    console.log("Product Service test START");
    console.log("==========================");
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  it("create should add a product", async () => {
    const result = await productService.createProduct({
      name: "Product 3",
      price: "25.00",
      category_id: 1
    });

    createdProdcutId = result.id!;

    expect(result).toEqual({
      id: createdProdcutId,
      name: "Product 3",
      price: "25.00",
      category_id: 1
    });
  });

  it("create should throw an error if category not found", async () => {
    let errorCode: number;

    try {
      await productService.createProduct({
        name: "Product 5",
        price: "25.00",
        category_id: 999
      });
    } catch (err) {
      if (err instanceof APIError) {
        errorCode = err.errorCode;
      }
    }

    expect(errorCode!).toEqual(3200);
  });

  it("create should throw an error if prodcut is already exists", async () => {
    let errorCode: number;

    try {
      await productService.createProduct({
        name: "Product 3",
        price: "25",
        category_id: 1
      });
    } catch (err) {
      if (err instanceof APIError) {
        errorCode = err.errorCode;
      }
    }

    expect(errorCode!).toEqual(3201);
  });

  it("getAllProducts should returns at least one item", async () => {
    const result = await productService.getAllProducts();

    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("getProductById should returns product 3", async () => {
    const result = await productService.getProductById(createdProdcutId);

    expect(result).toEqual({
      id: createdProdcutId,
      name: "Product 3",
      price: "25.00",
      category_id: 1
    });
  });

  it("getCategoryProducts should returns at least one item", async () => {
    const result = await productService.getCategoryProducts(1);

    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("deleteProduct should delete product 3", async () => {
    const result = await productService.deleteProduct(createdProdcutId);

    expect(result).toEqual({
      id: createdProdcutId,
      name: "Product 3",
      price: "25.00",
      category_id: 1
    });
  });
});
