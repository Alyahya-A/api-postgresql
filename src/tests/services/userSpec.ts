// import bcrypt from "bcrypt";
// import dotenv from "dotenv";
// import Client from "../../database";
// import { UserRepository } from "../../repositories/userRepository";
// import { UserService } from "../../services/userService";
// import { productList } from "../helpers/productTestData";
// import { userList, userListWithIdAndNoPwd } from "../helpers/userTestData";

// dotenv.config();
// const { PEPPER, SALT_ROUNDS } = process.env;

// const _userService = new UserService(new UserRepository());

// describe("User   method", () => {
//   beforeAll(async () => {
//     const connection = await Client.connect();
//     const sql =
//       "INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4);";

//     for (const user of userList) {
//       const hashedPassword = bcrypt.hashSync(
//         user.password + PEPPER,
//         parseInt(SALT_ROUNDS as unknown as string)
//       );
//       await connection.query(sql, [
//         user.username,
//         user.firstName,
//         user.lastName,
//         hashedPassword
//       ]);
//     }

//     connection.release();
//   });

//   it("index should return a list of all users", async () => {
//     const result = await _userService.index();
//     const resultWithoutPwd = result.map((user) => {
//       return _.pick(user, ["id", "username", "firstName", "lastName"]);
//     });
//     const pwdChecks = result.every((user: User, i: number) => {
//       return bcrypt.compareSync(userList[i].password + PEPPER, user.password);
//     });

//     expect(resultWithoutPwd).toEqual(userListWithIdAndNoPwd);
//     expect(pwdChecks).toBe(true);
//   });

//   it("create should add a user", async () => {
//     const result = await _userService.create({
//       username: "testuser4",
//       firstName: "Roger",
//       lastName: "Taylor",
//       password: "testpwd4"
//     });
//     const resultWithoutPwd = _.pick(result, [
//       "id",
//       "username",
//       "firstName",
//       "lastName"
//     ]);
//     const pwdCheck = bcrypt.compareSync("testpwd4" + PEPPER, result.password);

//     expect(pwdCheck).toBe(true);
//     expect(resultWithoutPwd).toEqual({
//       id: 4,
//       username: "testuser4",
//       firstName: "Roger",
//       lastName: "Taylor"
//     });
//   });

//   it("show should return the user with the given id", async () => {
//     const result = await _userService.show(4);
//     const resultWithoutPwd = _.pick(result, [
//       "id",
//       "username",
//       "firstName",
//       "lastName"
//     ]);
//     const pwdCheck = bcrypt.compareSync("testpwd4" + PEPPER, result.password);

//     expect(pwdCheck).toBe(true);
//     expect(resultWithoutPwd).toEqual({
//       id: 4,
//       username: "testuser4",
//       firstName: "Roger",
//       lastName: "Taylor"
//     });
//   });

//   it("authenticate should return null for the wrong user and password combination", async () => {
//     const result = await _userService.authenticate("testuser1", "testpwd2");

//     expect(result).toBe(null);
//   });

//   it("authenticate should return a user for the right user and password combination", async () => {
//     const result = await _userService.authenticate("testuser1", "testpwd1");
//     const resultWithoutPwd = _.pick(result, [
//       "id",
//       "username",
//       "firstName",
//       "lastName"
//     ]);

//     expect(resultWithoutPwd).toEqual(userListWithIdAndNoPwd[0]);
//   });

//   afterAll(async () => {
//     const connection = await Client.connect();
//     await connection.query("DELETE FROM users;");
//     await connection.query("ALTER SEQUENCE users_id_seq RESTART WITH 1;");
//     connection.release();
//   });
// });

// describe("User can modify orders", () => {
//   it("with an addProductToOrder method", () => {
//     expect(_userService.addProductToOrder).toBeDefined();
//   });

//   it("with a removeProductFromOrder method", () => {
//     expect(_userService.removeProductFromOrder).toBeDefined();
//   });
// });

// describe("User method to modify orders", () => {
//   const productStore = new ProductStore();
//   const orderStore = new OrderStore();
//   const testUser = userList[0];
//   const testProduct = productList[0];

//   beforeAll(async () => {
//     await _userService.create(testUser);
//     await productStore.create(testProduct);
//     await orderStore.create(1);
//   });

//   it("addProductToOrder adds a product to an active order", async () => {
//     const result = await _userService.addProductToOrder(1, 1, 10);

//     expect(result).toEqual({
//       id: 1,
//       productId: 1,
//       quantity: 10,
//       orderId: 1
//     });
//   });

//   it("removeProductFromOrder returns the removed order details from an active order", async () => {
//     const result = await _userService.removeProductFromOrder(1, 1);

//     expect(result).toEqual({
//       id: 1,
//       productId: 1,
//       quantity: 10,
//       orderId: 1
//     });
//   });

//   afterAll(async () => {
//     const connection = await Client.connect();
//     await connection.query("DELETE FROM users;");
//     await connection.query("ALTER SEQUENCE users_id_seq RESTART WITH 1;");
//     await connection.query("DELETE FROM orders;");
//     await connection.query("ALTER SEQUENCE orders_id_seq RESTART WITH 1;");
//     await connection.query("DELETE FROM products;");
//     await connection.query("ALTER SEQUENCE products_id_seq RESTART WITH 1;");
//     await connection.query("DELETE FROM order_details;");
//     await connection.query(
//       "ALTER SEQUENCE order_details_id_seq RESTART WITH 1;"
//     );
//     connection.release();
//   });
// });
