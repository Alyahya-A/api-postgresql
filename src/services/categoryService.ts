import { inject, injectable } from 'inversify';
import { StatusCode } from '../consts/statusCodes';
import TYPES from '../consts/types';
import { Category } from '../interfaces/category';
import { APIError } from '../models/errors/apiError';
import { CategoryRepository } from '../repositories/categoryRepository';

@injectable()
export class CategoryService {
  constructor(
    @inject(TYPES.CategoryRepository)
    private readonly _categoryRepo: CategoryRepository
  ) {}

  public getAllCategories = async (): Promise<Category[]> => {
    return await this._categoryRepo.index();
  };

  public async createCategory(body: Category): Promise<Category> {
    if (await this._categoryRepo.existsByName(body.name)) {
      throw new APIError(
        `Category \"${body.name}\" is already exists`,
        1200,
        StatusCode.badRequest,
        true
      );
    }

    return await this._categoryRepo.create(body);
  }

  public async existsById(id: number): Promise<boolean> {
    return await this._categoryRepo.exists(id);
  }

  public async getCategoryById(id: number): Promise<Category> {
    return await this._categoryRepo.getById(id);
  }

  public async deleteCategory(id: number): Promise<Category> {
    if (!(await this._categoryRepo.exists(id))) {
      throw new APIError(
        `Category \"${id}\" is not exists`,
        1201,
        StatusCode.badRequest,
        true
      );
    }

    return await this._categoryRepo.delete(id);
  }
}
