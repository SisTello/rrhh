import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('roles')
@Controller({ path: 'roles', version: '1' })
export class RolesController extends CrudScaffoldController {}
