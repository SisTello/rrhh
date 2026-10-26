import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('approvals')
@Controller({ path: 'approvals', version: '1' })
export class ApprovalsController extends CrudScaffoldController {}
