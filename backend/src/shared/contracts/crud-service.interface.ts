export interface CrudService<TEntity, TCreate, TUpdate> {
  findAll(): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity>;
  create(input: TCreate): Promise<TEntity>;
  update(id: string, input: TUpdate): Promise<TEntity>;
  remove(id: string): Promise<void>;
}
