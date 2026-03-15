import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectQueue('notification-queue')
    private queue: Queue,
  ) {}

  async create(dto: CreateNotificationDto) {
    // Don't notify yourself
    if (dto.senderId === dto.receiverId) return;

    const notification = this.notificationRepo.create(dto);
    const saved = await this.notificationRepo.save(notification);

    // Queue email/push jobs
    await this.queue.add('send-notification', {
      notificationId: saved.id,
      ...dto,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });

    return saved;
  }

  async getUserNotifications(userId: number, page: number = 1, limit: number = 20) {
    const [data, total] = await this.notificationRepo.findAndCount({
      where: { receiverId: userId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getUnreadCount(userId: number) {
    const count = await this.notificationRepo.count({
      where: { receiverId: userId, isRead: false },
    });
    return { unreadCount: count };
  }

  async markAsRead(userId: number, notificationId: number) {
    await this.notificationRepo.update(
      { id: notificationId, receiverId: userId },
      { isRead: true },
    );
    return { message: 'Marked as read' };
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepo.update(
      { receiverId: userId, isRead: false },
      { isRead: true },
    );
    return { message: 'All notifications marked as read' };
  }
}
