// container should be imported before any interface or other imports
// so to to make sure reflect-metadata is first import
import { container } from '../../di-container';

// Other imports
import { cleanUpMetadata } from 'inversify-express-utils';
import TYPES from '../../consts/types';
import { Category } from '../../interfaces/category';
import { APIError } from '../../models/errors/apiError';
import { CategoryService } from '../../services/categoryService';
import { ProductService } from '../../services/productService';

describe('Product Service', () => {
  const productService = container.get<ProductService>(TYPES.ProductService);
  let createdProdcutId: number;
  let createdCategoryId: number;

  beforeAll(async () => {
    console.log('');
    console.log('==========================');
    console.log('Product Service test START');
    console.log('==========================');

    // Add category to use it in test
    const categoryService = container.get<CategoryService>(
      TYPES.CategoryService
    );

    const category: Category = await categoryService.createCategory({
      name: 'Jewelry',
      description: 'Jewelry categoty'
    });

    createdCategoryId = category.id!;
  });

  beforeEach(() => {
    cleanUpMetadata();
  });

  it('create should add a product', async () => {
    const result = await productService.createProduct({
      name: 'Product-3',
      price: '25.00',
      category_id: createdCategoryId
    });

    createdProdcutId = result.id!;

    expect(result).toEqual({
      id: createdProdcutId,
      name: 'Product-3',
      price: '25.00',
      category_id: createdCategoryId
    });
  });

  it('create should throw an error if category not found', async () => {
    let errorCode: number;

    try {
      await productService.createProduct({
        name: 'Product 5',
        price: '25.00',
        category_id: 999
      });
    } catch (err) {
      if (err instanceof APIError) {
        errorCode = err.errorCode;
      }
    }

    expect(errorCode!).toEqual(3200);
  });

  it('create should throw an error if prodcut is already exists', async () => {
    let errorCode: number;

    try {
      await productService.createProduct({
        name: 'Product-3',
        price: '25',
        category_id: createdCategoryId
      });
    } catch (err) {
      if (err instanceof APIError) {
        errorCode = err.errorCode;
      }
    }

    expect(errorCode!).toEqual(3201);
  });

  it('getAllProducts should returns at least one item', async () => {
    const result = await productService.getAllProducts();

    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('getProductById should returns Product-3', async () => {
    const result = await productService.getProductById(createdProdcutId);

    expect(result).toEqual({
      id: createdProdcutId,
      name: 'Product-3',
      price: '25.00',
      category_id: createdCategoryId
    });
  });

  it('getCategoryProducts should returns at least one item', async () => {
    const result = await productService.getCategoryProducts(createdCategoryId);

    expect(result.length).toEqual(1);
    expect(result).toEqual([
      {
        id: createdProdcutId,
        name: 'Product-3',
        price: '25.00',
        category_id: createdCategoryId
      }
    ]);
  });

  it('deleteProduct should delete Product-3', async () => {
    const result = await productService.deleteProduct(createdProdcutId);

    expect(result).toEqual({
      id: createdProdcutId,
      name: 'Product-3',
      price: '25.00',
      category_id: createdCategoryId
    });
  });
});
