import { Container } from "inversify";
import { CategoryRepository } from "./repositories/categoryRepository";
import { ProductRepository } from "./repositories/productRepository";
import { CategoryService } from "./services/categoryService";
import { ProductService } from "./services/productService";

import "./controllers/productController";

export const container = new Container({
  defaultScope: "Singleton"
});

//////////////////////////////////////////////////
////////// Dependency Injection | START //////////
//////////////////////////////////////////////////

// Bind Repositoreis
container.bind(ProductRepository).toSelf();
container.bind(CategoryRepository).toSelf();

// Bind Services
container.bind(ProductService).toSelf();
container.bind(CategoryService).toSelf();

//////////////////////////////////////////////////
////////// Dependency Injection |  END  //////////
//////////////////////////////////////////////////
