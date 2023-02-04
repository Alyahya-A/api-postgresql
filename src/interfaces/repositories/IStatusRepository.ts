import { BaseRepository } from './baseRepository';

export interface IStatusRepository<T> extends BaseRepository<T> {
  existsByName(name: string): Promise<boolean>;
  existsByCode(code: number): Promise<boolean>;
}
