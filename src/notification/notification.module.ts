import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { NotificationListener } from './notification.listener';
import { NotificationProcessor } from './notification.processor';
import { NotificationGateway } from './notification.gateway';
import { Post } from '../post/entities/post.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Post]),
    BullModule.registerQueue({ name: 'notification-queue' }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationListener,
    NotificationProcessor,
    NotificationGateway,
  ],
})
export class NotificationModule {}
