//reflect-metadata should be imported before any interface or other imports
//also it should be imported only once, so that a singleton is created.
import 'reflect-metadata';

import { Container } from 'inversify';
import { CategoryRepository } from './repositories/categoryRepository';
import { ProductRepository } from './repositories/productRepository';
import { CategoryService } from './services/categoryService';
import { ProductService } from './services/productService';

import TYPES from './consts/types';
import { ApplicationContext } from './contexts/applicationContext';
import { UserContext } from './contexts/userContext';
import { Category } from './interfaces/category';
import { LkStatus } from './interfaces/lkStatus';
import { Product } from './interfaces/product';
import { ICategoryRepository } from './interfaces/repositories/ICategoryRepository';
import { IProductRepository } from './interfaces/repositories/IProductRepository';
import { IStatusRepository } from './interfaces/repositories/IStatusRepository';
import { IUserRepository } from './interfaces/repositories/IUserRepository';
import { User } from './interfaces/user';
import { AuthMiddleware } from './middlewares/authMiddleware';
import { StatusRepository } from './repositories/statusRepository';
import { UserRepository } from './repositories/userRepository';
import { StatusService } from './services/statusService';
import { UserService } from './services/userService';
// Controllers are required to imported one unique time
import './controllers/categoryController';
import { CategoryController } from './controllers/categoryController';
import './controllers/orderController';
import { OrderController } from './controllers/orderController';
import './controllers/productController';
import { ProductController } from './controllers/productController';
import './controllers/statusController';
import { StatusController } from './controllers/statusController';
import './controllers/tokenController';
import './controllers/userController';
import { UserController } from './controllers/userController';
import { Order } from './interfaces/order';
import { IOrderRepository } from './interfaces/repositories/IOrderRepository';
import { OrderRepository } from './repositories/orderRepository';
import { OrderService } from './services/orderService';

export const container = new Container({
  defaultScope: 'Singleton'
});

//////////////////////////////////////////////////
////////// Dependency Injection | START //////////
//////////////////////////////////////////////////

// Bind Middlewares
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

// Bind Contexts
container.bind<UserContext>(TYPES.UserContext).to(UserContext);
container
  .bind<ApplicationContext>(TYPES.ApplicationContext)
  .to(ApplicationContext);

// Bind Controller
container
  .bind<ProductController>(TYPES.ProductController)
  .to(ProductController);
container
  .bind<CategoryController>(TYPES.CategoryController)
  .to(CategoryController);
container.bind<StatusController>(TYPES.StatusController).to(StatusController);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<OrderController>(TYPES.OrderController).to(OrderController);

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

container
  .bind<IOrderRepository<Order>>(TYPES.OrderRepository)
  .to(OrderRepository);

// Bind Services
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind<StatusService>(TYPES.StatusService).to(StatusService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<OrderService>(TYPES.OrderService).to(OrderService);

//////////////////////////////////////////////////
////////// Dependency Injection |  END  //////////
//////////////////////////////////////////////////
