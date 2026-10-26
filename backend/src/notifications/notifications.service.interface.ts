import { CrudService } from '../shared/contracts/crud-service.interface';

export interface NotificationRecord {
  id: string;
}

export interface NotificationsService
  extends CrudService<NotificationRecord, Record<string, unknown>, Record<string, unknown>> {}
