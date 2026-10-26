export interface AuditLogRecord {
  id: string;
}

export interface AuditLogsService {
  findAll(): Promise<AuditLogRecord[]>;
  findById(id: string): Promise<AuditLogRecord>;
}
