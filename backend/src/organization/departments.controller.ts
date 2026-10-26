import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('departments')
@Controller({ path: 'departments', version: '1' })
export class DepartmentsController extends CrudScaffoldController {}
