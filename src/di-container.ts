import { Container } from "inversify";
import { CategoryRepository } from "./repositories/categoryRepository";
import { ProductRepository } from "./repositories/productRepository";
import { CategoryService } from "./services/categoryService";
import { ProductService } from "./services/productService";

import express from "express";
import "./controllers/productController";
import { AuthMiddleware } from "./middlewares/authMiddleware";
import { StatusRepository } from "./repositories/statusRepository";
import { UserRepository } from "./repositories/userRepository";
import { StatusService } from "./services/statusService";
import { UserService } from "./services/userService";

export const container = new Container({
  defaultScope: "Singleton"
});

//////////////////////////////////////////////////
////////// Dependency Injection | START //////////
//////////////////////////////////////////////////

// container.bind(chec).toDynamicValue((context: interfaces.Context) => {
//   let authService = context.container.get(UserService);
//   return authorizeMiddlewareFactory(authService);
// });

export const TYPES = {
  AuthMiddleware: Symbol.for("AuthMiddleware")
};

container
  .bind<express.RequestHandler>(TYPES.AuthMiddleware)
  .toConstantValue((req: any, res: any, next: any) =>
    new AuthMiddleware(container.get<UserService>(UserService)).authenticate(
      req,
      res,
      next
    )
  );

// Bind Repositoreis
container.bind<ProductRepository>(ProductRepository).toSelf();
container.bind<CategoryRepository>(CategoryRepository).toSelf();
container.bind<StatusRepository>(StatusRepository).toSelf();
container.bind<UserRepository>(UserRepository).toSelf();

// Bind Services
container.bind<ProductService>(ProductService).toSelf();
container.bind<CategoryService>(CategoryService).toSelf();
container.bind<StatusService>(StatusService).toSelf();
container.bind<UserService>(UserService).toSelf();

//////////////////////////////////////////////////
////////// Dependency Injection |  END  //////////
//////////////////////////////////////////////////
