import { CrudService } from '../shared/contracts/crud-service.interface';

export interface RequestRecord {
  id: string;
}

export interface RequestsService
  extends CrudService<RequestRecord, Record<string, unknown>, Record<string, unknown>> {}

export interface ApprovalsService
  extends CrudService<RequestRecord, Record<string, unknown>, Record<string, unknown>> {}
