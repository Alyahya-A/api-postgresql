// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { CategoryRepository } from '../../repositories/categoryRepository';

describe('Category Repository', () => {
  const categotyRepository = container.get<CategoryRepository>(
    TYPES.CategoryRepository
  );

  beforeAll(() => {
    console.log('');
    console.log('=============================');
    console.log('Category Repository test START');
    console.log('=============================');
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  // BaseRepository -- START
  it('has a index method', () => {
    expect(categotyRepository.index).toBeDefined();
  });
  it('has a getById method', () => {
    expect(categotyRepository.getById).toBeDefined();
  });
  it('has a create method', () => {
    expect(categotyRepository.create).toBeDefined();
  });

  it('has a exists method', () => {
    expect(categotyRepository.exists).toBeDefined();
  });

  it('has a delete method', () => {
    expect(categotyRepository.delete).toBeDefined();
  });
  // BaseRepository -- END
  it('has a existsByName method', () => {
    expect(categotyRepository.existsByName).toBeDefined();
  });

  it('has a existsByName method', () => {
    expect(categotyRepository.existsByName).toBeDefined();
  });
});
