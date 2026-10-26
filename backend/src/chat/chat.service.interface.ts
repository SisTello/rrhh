import { CrudService } from '../shared/contracts/crud-service.interface';

export interface ConversationRecord {
  id: string;
}

export interface ChatService
  extends CrudService<ConversationRecord, Record<string, unknown>, Record<string, unknown>> {}
