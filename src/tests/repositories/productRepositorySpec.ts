// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { ProductRepository } from '../../repositories/productRepository';

describe('Product Repository', () => {
  const productRepository = container.get<ProductRepository>(
    TYPES.ProductRepository
  );

  beforeAll(() => {
    console.log('');
    console.log('=============================');
    console.log('Product Repository test START');
    console.log('=============================');
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  // BaseRepository -- START
  it('has a index method', () => {
    expect(productRepository.index).toBeDefined();
  });
  it('has a getById method', () => {
    expect(productRepository.getById).toBeDefined();
  });
  it('has a create method', () => {
    expect(productRepository.create).toBeDefined();
  });

  it('has a exists method', () => {
    expect(productRepository.exists).toBeDefined();
  });

  it('has a delete method', () => {
    expect(productRepository.delete).toBeDefined();
  });
  // BaseRepository -- END
  it('has a existsByName method', () => {
    expect(productRepository.existsByName).toBeDefined();
  });

  it('has a getCategoryProducts method', () => {
    expect(productRepository.getCategoryProducts).toBeDefined();
  });
});
