import { CrudService } from '../shared/contracts/crud-service.interface';

export interface EmployeeRecord {
  id: string;
}

export interface EmployeesService
  extends CrudService<EmployeeRecord, Record<string, unknown>, Record<string, unknown>> {}
