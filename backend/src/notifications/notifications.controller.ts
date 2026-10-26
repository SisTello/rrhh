import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController extends CrudScaffoldController {}
