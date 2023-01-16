import { Container } from "inversify";
import { CategoryRepository } from "./repositories/categoryRepository";
import { ProductRepository } from "./repositories/productRepository";
import { CategoryService } from "./services/categoryService";
import { ProductService } from "./services/productService";

import "./controllers/productController";
import { Category } from "./interfaces/category";
import { LkStatus } from "./interfaces/lkStatus";
import { Product } from "./interfaces/product";
import { ICategoryRepository } from "./interfaces/repositories/ICategoryRepository";
import { IProductRepository } from "./interfaces/repositories/IProductRepository";
import { IStatusRepository } from "./interfaces/repositories/IStatusRepository";
import { IUserRepository } from "./interfaces/repositories/IUserRepository";
import { User } from "./interfaces/user";
import { StatusRepository } from "./repositories/statusRepository";
import { UserRepository } from "./repositories/userRepository";
import { StatusService } from "./services/statusService";
import { UserService } from "./services/userService";

import TYPES from "./consts/types";
import { AuthMiddleware } from "./middlewares/authMiddleware";

// Controllers are required to imported one unique time
import "./controllers/categoryController";
import "./controllers/productController";
import "./controllers/statusController";
import "./controllers/tokenController";
import "./controllers/userController";

export const container = new Container({
  defaultScope: "Singleton"
});

//////////////////////////////////////////////////
////////// Dependency Injection | START //////////
//////////////////////////////////////////////////

// container
//   .bind<express.RequestHandler>(TYPES.AuthMiddleware)
//   .toConstantValue((req: any, res: any, next: any) =>
//     new AuthMiddleware(container.get<UserService>(UserService)).authenticate(
//       req,
//       res,
//       next
//     )
//   );

// Bind Middlewares
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

// Bind Repositoreis
container
  .bind<IProductRepository<Product>>(TYPES.ProductRepository)
  .to(ProductRepository);

container
  .bind<ICategoryRepository<Category>>(TYPES.CategoryRepository)
  .to(CategoryRepository);

container
  .bind<IStatusRepository<LkStatus>>(TYPES.StatusRepository)
  .to(StatusRepository);

container.bind<IUserRepository<User>>(TYPES.UserRepository).to(UserRepository);

// Bind Services
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind<StatusService>(TYPES.StatusService).to(StatusService);
container.bind<UserService>(TYPES.UserService).to(UserService);

//////////////////////////////////////////////////
////////// Dependency Injection |  END  //////////
//////////////////////////////////////////////////
