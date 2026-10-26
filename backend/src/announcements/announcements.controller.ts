import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('announcements')
@Controller({ path: 'announcements', version: '1' })
export class AnnouncementsController extends CrudScaffoldController {}
