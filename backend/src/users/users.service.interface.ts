import { CrudService } from '../shared/contracts/crud-service.interface';

export interface UserRecord {
  id: string;
}

export interface UsersService
  extends CrudService<UserRecord, Record<string, unknown>, Record<string, unknown>> {}
