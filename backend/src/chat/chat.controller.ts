import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudScaffoldController } from '../shared/http/crud-scaffold.controller';

@ApiTags('conversations')
@Controller({ path: 'conversations', version: '1' })
export class ChatController extends CrudScaffoldController {}
