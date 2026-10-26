import { CrudService } from '../shared/contracts/crud-service.interface';

export interface AnnouncementRecord {
  id: string;
}

export interface AnnouncementsService
  extends CrudService<AnnouncementRecord, Record<string, unknown>, Record<string, unknown>> {}
