import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  senderId: number;
  receiverId: number;
  type: NotificationType;
  postId?: number;
  message: string;
}
