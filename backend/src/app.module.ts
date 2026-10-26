import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApprovalsModule } from './approvals/approvals.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { EmployeesModule } from './employees/employees.module';
import { ExternalIntegrationsModule } from './external-integrations/external-integrations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrganizationModule } from './organization/organization.module';
import { PrismaModule } from './shared/database/prisma.module';
import { SharedServicesModule } from './shared/shared-services.module';
import { RbacModule } from './rbac/rbac.module';
import { UsersModule } from './users/users.module';

const environmentSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  FRONTEND_ORIGIN: Joi.string()
    .default('http://localhost:5173')
    .custom((value: string, helpers: Joi.CustomHelpers) => {
      const origins = value.split(',').map((origin) => origin.trim());
      const valid = origins.every((origin) => {
        try {
          const parsed = new URL(origin);
          return (
            ['http:', 'https:'].includes(parsed.protocol) &&
            parsed.origin === origin
          );
        } catch {
          return false;
        }
      });
      return valid ? value : helpers.error('any.invalid');
    }),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
}).unknown();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentSchema,
      validationOptions: { abortEarly: false },
    }),
    PrismaModule,
    SharedServicesModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    RbacModule,
    OrganizationModule,
    AnnouncementsModule,
    ApprovalsModule,
    ChatModule,
    NotificationsModule,
    AuditLogsModule,
    ExternalIntegrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
