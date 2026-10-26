import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('positions')
@Controller({ path: 'positions', version: '1' })
export class PositionsController extends CrudScaffoldController {}
