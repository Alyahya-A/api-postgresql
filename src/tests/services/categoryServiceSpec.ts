// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { APIError } from '../../models/errors/apiError';
import { CategoryService } from '../../services/categoryService';

describe('Category Service', () => {
  const categoryService = container.get<CategoryService>(TYPES.CategoryService);
  let createdCategoryId: number;

  beforeAll(async () => {
    console.log('');
    console.log('==========================');
    console.log('Category Service test START');
    console.log('==========================');
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  it('create should add a category', async () => {
    const result = await categoryService.createCategory({
      name: 'Apparel',
      description: 'Apparel categoty'
    });

    createdCategoryId = result.id!;

    expect(result).toEqual({
      id: createdCategoryId,
      name: 'Apparel',
      description: 'Apparel categoty'
    });
  });

  it('create should throw an error if category is already exists', async () => {
    let errorCode: number;

    try {
      await categoryService.createCategory({
        name: 'Apparel',
        description: 'Apparel categoty'
      });
    } catch (err) {
      if (err instanceof APIError) {
        errorCode = err.errorCode;
      }
    }

    expect(errorCode!).toEqual(1200);
  });

  it('getAllCategories should returns at least one item', async () => {
    const result = await categoryService.getAllCategories();

    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('getCategoryById should returns category', async () => {
    const result = await categoryService.getCategoryById(createdCategoryId);

    expect(result).toEqual({
      id: createdCategoryId,
      name: 'Apparel',
      description: 'Apparel categoty'
    });
  });

  it('existsById should returns true', async () => {
    const result = await categoryService.existsById(createdCategoryId);

    expect(result).toBeTruthy();
  });

  it('deleteCategory should delete category', async () => {
    const result = await categoryService.deleteCategory(createdCategoryId);

    expect(result).toEqual({
      id: createdCategoryId,
      name: 'Apparel',
      description: 'Apparel categoty'
    });
  });
});
