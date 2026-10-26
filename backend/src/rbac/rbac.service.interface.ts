import { CrudService } from '../shared/contracts/crud-service.interface';

export interface RbacRecord {
  id: string;
}

export interface RolesService
  extends CrudService<RbacRecord, Record<string, unknown>, Record<string, unknown>> {}

export interface PermissionsService
  extends CrudService<RbacRecord, Record<string, unknown>, Record<string, unknown>> {}
