import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('branches')
@Controller({ path: 'branches', version: '1' })
export class BranchesController extends CrudScaffoldController {}
