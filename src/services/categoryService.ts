import { injectable } from "inversify";
import { Category } from "../interfaces/category";
import { CategoryRepository } from "../repositories/categoryRepository";

@injectable()
export class CategoryService {
  constructor(private readonly _categoryRepo: CategoryRepository) {}

  public getAllCategorys = async (): Promise<Category[]> => {
    return await this._categoryRepo.index();
  };

  public async createCategory(body: Category): Promise<Category> {
    return await this._categoryRepo.create(body);
  }

  public async existsById(id: number): Promise<boolean> {
    return await this._categoryRepo.exists(id);
  }
}
