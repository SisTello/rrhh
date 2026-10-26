import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('employees')
@Controller({ path: 'employees', version: '1' })
export class EmployeesController extends CrudScaffoldController {}
