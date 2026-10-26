import { CrudService } from '../shared/contracts/crud-service.interface';

export interface OrganizationRecord {
  id: string;
}

export interface DepartmentsService
  extends CrudService<OrganizationRecord, Record<string, unknown>, Record<string, unknown>> {}

export interface BranchesService
  extends CrudService<OrganizationRecord, Record<string, unknown>, Record<string, unknown>> {}

export interface PositionsService
  extends CrudService<OrganizationRecord, Record<string, unknown>, Record<string, unknown>> {}
