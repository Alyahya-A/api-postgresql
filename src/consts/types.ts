const TYPES = {
  AuthMiddleware: Symbol.for('AuthMiddleware'),

  ApplicationContext: Symbol.for('ApplicationContext'),
  UserContext: Symbol.for('UserContext'),

  ProductController: Symbol.for('ProductController'),
  CategoryController: Symbol.for('CategoryController'),
  StatusController: Symbol.for('StatusController'),
  UserController: Symbol.for('UserController'),
  OrderController: Symbol.for('OrderController'),

  ProductRepository: Symbol.for('ProductRepository'),
  CategoryRepository: Symbol.for('CategoryRepository'),
  StatusRepository: Symbol.for('StatusRepository'),
  UserRepository: Symbol.for('UserRepository'),
  OrderRepository: Symbol.for('OrderRepository'),

  ProductService: Symbol.for('ProductService'),
  CategoryService: Symbol.for('CategoryService'),
  StatusService: Symbol.for('StatusService'),
  UserService: Symbol.for('UserService'),
  OrderService: Symbol.for('OrderService')
};

export default TYPES;
