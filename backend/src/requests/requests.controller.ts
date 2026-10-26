import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('requests')
@Controller({ path: 'requests', version: '1' })
export class RequestsController extends CrudScaffoldController {}
