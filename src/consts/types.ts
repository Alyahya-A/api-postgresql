const TYPES = {
  AuthMiddleware: Symbol.for("AuthMiddleware"),

  ApplicationContext: Symbol.for("ApplicationContext"),
  UserContext: Symbol.for("UserContext"),

  ProductRepository: Symbol.for("ProductRepository"),
  CategoryRepository: Symbol.for("CategoryRepository"),
  StatusRepository: Symbol.for("StatusRepository"),
  UserRepository: Symbol.for("UserRepository"),

  ProductService: Symbol.for("ProductService"),
  CategoryService: Symbol.for("CategoryService"),
  StatusService: Symbol.for("StatusService"),
  UserService: Symbol.for("UserService")
};

export default TYPES;
