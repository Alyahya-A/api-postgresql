// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { APIError } from '../../models/errors/apiError';
import { OrderService } from '../../services/orderService';
import { UserService } from '../../services/userService';

describe('Order Service', () => {
  const orderService = container.get<OrderService>(TYPES.OrderService);
  let createdOrderId: number;

  beforeAll(async () => {
    console.log('');
    console.log('========================');
    console.log('Order Service test START');
    console.log('========================');

    const userService = container.get<UserService>(TYPES.UserService);

    try {
      await userService.createUser({
        id: 1,
        firstname: 'Abdulrahman',
        lastname: 'Alyahya',
        email: 'alyahya@alyahya.dev',
        password_encrypt: ''
      });
    } catch (error) {
      // bypass
    }
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  it('create should add an order', async () => {
    const result = await orderService.createOrder(1);

    createdOrderId = result.id!;

    expect({
      userId: result.user_id,
      products: result.products,
      status: result.status
    }).toEqual({
      userId: 1,
      status: 'Active',
      products: []
    });
  });

  it('create should throw an error if an active order already exist with the same user id', async () => {
    let errorCode: number;

    try {
      await orderService.createOrder(1);
    } catch (err) {
      if (err instanceof APIError) {
        errorCode = err.errorCode;
      }
    }

    expect(errorCode!).toEqual(2200);
  });

  it('updateStatus should update an order to complete if an active order is present for given user id', async () => {
    const result = await orderService.completeOrder(createdOrderId);

    expect(result).toEqual({
      id: createdOrderId,
      user_id: 1,
      status: 'Completed',
      totalAmount: 0,
      products: []
    });
  });
});
