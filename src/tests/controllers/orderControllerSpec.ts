// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import supertest from 'supertest';
import { StatusCode } from '../../consts/statusCodes';
import TYPES from '../../consts/types';
import { Category } from '../../interfaces/category';
import { Product } from '../../interfaces/product';
import { APIError } from '../../models/errors/apiError';
import app from '../../server';
import { CategoryService } from '../../services/categoryService';
import { ProductService } from '../../services/productService';
import { UserService } from '../../services/userService';
import { userData } from '../helpers/userTestData';

const request = supertest(app);

describe('Order controller', () => {
  let token: string;

  beforeAll(async () => {
    console.log('');
    console.log('===========================');
    console.log('Order controller test START');
    console.log('===========================');

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

  it('gets on /orders: returns an active order in JSON format', async () => {
    // Arrange
    const response = await request
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send();

    // First run (no data)
    expect(response.status).toBe(StatusCode.notFound);
    expect(response.body).toEqual({
      title: 'No data found',
      httpCode: 404,
      isOperational: true,
      errorCode: 4000
    });
  });

  it('posts /orders: create order and returns it in JSON format', async () => {
    const response = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.created);
    expect(response.body).toEqual({
      id: 1,
      user_id: 1,
      products: [],
      status: 'Active'
    });
  });

  it('gets /orders/active: returns an active order by for the current user in JSON format', async () => {
    const response = await request
      .get('/api/orders/active')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id: 1,
      status: 'Active',
      user_id: 1,
      products: []
    });
  });

  it('posts /orders/1/products: add an item to the cureent active orderand returns it in JSON format', async () => {
    const categoryService = container.get<CategoryService>(
      TYPES.CategoryService
    );

    const category: Category = await categoryService.createCategory({
      name: 'Electronics',
      description: 'Electronics categoty'
    });

    const productService = container.get<ProductService>(TYPES.ProductService);

    const product: Product = await productService.createProduct({
      name: 'Product 1',
      price: '15',
      category_id: category.id!
    });

    const response = await request
      .post('/api/orders/1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_id: product.id!,
        quantity: 2
      });

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id: 1,
      order_id: 1,
      product_id: 1,
      quantity: 2
    });
  });

  it('gets /orders/active: returns an active order with its products in JSON format', async () => {
    const response = await request
      .get('/api/orders/active')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id: 1,
      status: 'Active',
      user_id: 1,
      products: [
        {
          id: 1,
          order_id: 1,
          product_id: 1,
          quantity: 2
        }
      ]
    });
  });

  it('puts /orders/1/complete: puts an order as completed and returns it in JSON format', async () => {
    const response = await request
      .put('/api/orders/1/complete')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual({
      id: 1,
      status: 'Completed',
      user_id: 1,
      products: [
        {
          id: 1,
          order_id: 1,
          product_id: 1,
          quantity: 2
        }
      ]
    });
  });

  it('gets /orders/completed: returns completed orders for current user in JSON format', async () => {
    const response = await request
      .get('/api/orders/completed')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(StatusCode.ok);
    expect(response.body).toEqual([
      {
        id: 1,
        status: 'Completed',
        user_id: 1,
        products: [
          {
            id: 1,
            order_id: 1,
            product_id: 1,
            quantity: 2
          }
        ]
      }
    ]);
  });
});
