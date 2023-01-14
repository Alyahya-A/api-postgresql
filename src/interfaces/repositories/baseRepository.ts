export interface BaseRepository<T> {
  index(): Promise<T[]>;
  getById(id: number): Promise<T>;
  create(entity: T): Promise<T>;
  exists(id: number): Promise<boolean>;
  delete(id: number): Promise<T>;
}
