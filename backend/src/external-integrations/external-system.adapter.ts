export interface ExternalSystemAdapter<TRecord, TRequest> {
  synchronize(request: TRequest): Promise<TRecord>;
}
