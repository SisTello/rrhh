import { Module } from '@nestjs/common';
import { ApprovalsController } from '../requests/approvals.controller';
import { RequestsController } from '../requests/requests.controller';
import { ApprovalsGateway } from './approvals.gateway';

@Module({
  controllers: [RequestsController, ApprovalsController],
  providers: [ApprovalsGateway],
})
export class ApprovalsModule {}
