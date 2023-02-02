// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from "../../di-container";

// Other imports
import { cleanUpMetadata } from "inversify-express-utils";
import supertest from "supertest";
import { StatusCode } from "../../consts/statusCodes";
import TYPES from "../../consts/types";
import { APIError } from "../../models/errors/apiError";
import app from "../../server";
import { UserService } from "../../services/userService";
import { userData } from "../helpers/userTestData";

const request = supertest(app);

describe("Products controller", () => {
  let token: string;

  beforeAll(async () => {
    console.log("");
    console.log("==============================");
    console.log("Products controller test START");
    console.log("==============================");

    const userService = container.get<UserService>(TYPES.UserService);

    try {
      token = await userService.generateToken({
        email: userData.email,
        password: userData.password_encrypt
      });
    } catch (error) {
      if (error instanceof APIError && error.errorCode === 5202) {
        await userService.createUser({
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          password_encrypt: userData.password_encrypt
        });

        token = await userService.generateToken({
          email: userData.email,
          password: userData.password_encrypt
        });
      }
    }

    console.log(`token: ${token}`);
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  it("posts /products: create product and returns it", async () => {
    const response = await request
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Product 2",
        price: 10,
        category_id: 1
      });

    expect(response.status).toBe(StatusCode.created);
    expect(response.body).toEqual({
      id: 2,
      name: "Product 2",
      price: "10.00",
      category_id: 1
    });
  });

  it("gets /products: returns a list of products", async () => {
    const response = await request.get("/api/products");

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual([
      {
        id: 1,
        name: "Product 1",
        price: "15.00",
        category_id: 1
      },
      {
        id: 2,
        name: "Product 2",
        price: "10.00",
        category_id: 1
      }
    ]);
  });

  it("gets /products/:id: returns a product", async () => {
    const response = await request.get("/api/products/1");

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id: 1,
      name: "Product 1",
      price: "15.00",
      category_id: 1
    });
  });

  it("deletes /products/:id: returns the deleted product", async () => {
    const response = await request
      .delete("/api/products/2")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id: 2,
      name: "Product 2",
      price: "10.00",
      category_id: 1
    });
  });
});
