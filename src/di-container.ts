import { Container } from "inversify";
import { CategoryRepository } from "./repositories/categoryRepository";
import { ProductRepository } from "./repositories/productRepository";
import { CategoryService } from "./services/categoryService";
import { ProductService } from "./services/productService";

import "./controllers/productController";
import { StatusRepository } from "./repositories/StatusRepository";
import { StatusService } from "./services/StatusService";

export const container = new Container({
  defaultScope: "Singleton"
});

//////////////////////////////////////////////////
////////// Dependency Injection | START //////////
//////////////////////////////////////////////////

// Bind Repositoreis
container.bind(ProductRepository).toSelf();
container.bind(CategoryRepository).toSelf();
container.bind(StatusRepository).toSelf();

// Bind Services
container.bind(ProductService).toSelf();
container.bind(CategoryService).toSelf();
container.bind(StatusService).toSelf();

//////////////////////////////////////////////////
////////// Dependency Injection |  END  //////////
//////////////////////////////////////////////////
