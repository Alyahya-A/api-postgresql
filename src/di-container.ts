import { Container } from "inversify";
import { CategoryRepository } from "./repositories/categoryRepository";
import { ProductRepository } from "./repositories/productRepository";
import { CategoryService } from "./services/categoryService";
import { ProductService } from "./services/productService";

import TYPES from "./consts/types";
import { ApplicationContext } from "./contexts/applicationContext";
import { UserContext } from "./contexts/userContext";
import { Category } from "./interfaces/category";
import { LkStatus } from "./interfaces/lkStatus";
import { Product } from "./interfaces/product";
import { ICategoryRepository } from "./interfaces/repositories/ICategoryRepository";
import { IProductRepository } from "./interfaces/repositories/IProductRepository";
import { IStatusRepository } from "./interfaces/repositories/IStatusRepository";
import { IUserRepository } from "./interfaces/repositories/IUserRepository";
import { User } from "./interfaces/user";
import { AuthMiddleware } from "./middlewares/authMiddleware";
import { StatusRepository } from "./repositories/statusRepository";
import { UserRepository } from "./repositories/userRepository";
import { StatusService } from "./services/statusService";
import { UserService } from "./services/userService";
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

// Bind Contexts
container.bind<UserContext>(TYPES.UserContext).to(UserContext);
container
  .bind<ApplicationContext>(TYPES.ApplicationContext)
  .to(ApplicationContext);

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
