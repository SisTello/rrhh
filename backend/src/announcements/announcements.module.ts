import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsGateway } from './announcements.gateway';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsGateway],
})
export class AnnouncementsModule {}
