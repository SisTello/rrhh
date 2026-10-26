import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('audit-logs')
@Controller({ path: 'audit-logs', version: '1' })
export class AuditLogsController extends CrudScaffoldController {}
