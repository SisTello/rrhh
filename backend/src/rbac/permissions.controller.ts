import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('permissions')
@Controller({ path: 'permissions', version: '1' })
export class PermissionsController extends CrudScaffoldController {}
