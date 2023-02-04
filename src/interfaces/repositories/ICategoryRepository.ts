import { BaseRepository } from './baseRepository';

export interface ICategoryRepository<T> extends BaseRepository<T> {
  existsByName(name: string): Promise<boolean>;
}
