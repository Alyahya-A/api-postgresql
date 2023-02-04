// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { OrderRepository } from '../../repositories/orderRepository';

describe('Order Repository', () => {
  const orderRepository = container.get<OrderRepository>(TYPES.OrderRepository);

  beforeAll(() => {
    console.log('');
    console.log('===========================');
    console.log('Order Repository test START');
    console.log('===========================');
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  // BaseRepository -- START
  it('has a index method', () => {
    expect(orderRepository.index).toBeDefined();
  });
  it('has a getById method', () => {
    expect(orderRepository.getById).toBeDefined();
  });
  it('has a create method', () => {
    expect(orderRepository.create).toBeDefined();
  });

  it('has a exists method', () => {
    expect(orderRepository.exists).toBeDefined();
  });

  it('has a delete method', () => {
    expect(orderRepository.delete).toBeDefined();
  });
  // BaseRepository -- END
  it('has a addItem method', () => {
    expect(orderRepository.addItem).toBeDefined();
  });

  it('has a isOrderActive method', () => {
    expect(orderRepository.getActiveOrder).toBeDefined();
  });

  it('has a getActiveOrder method', () => {
    expect(orderRepository.getActiveOrder).toBeDefined();
  });

  it('has a getOrderItem method', () => {
    expect(orderRepository.getOrderItem).toBeDefined();
  });

  it('has a completeOrderByOrderId method', () => {
    expect(orderRepository.completeOrderByOrderId).toBeDefined();
  });

  it('has a completedOrdersByUserId method', () => {
    expect(orderRepository.completedOrdersByUserId).toBeDefined();
  });
});
