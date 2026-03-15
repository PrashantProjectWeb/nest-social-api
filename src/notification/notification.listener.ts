import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from './notification.service';
import { NotificationType } from './entities/notification.entity';
import { Post } from '../post/entities/post.entities';

@Injectable()
export class NotificationListener {
  constructor(
    private notificationService: NotificationService,
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  @OnEvent('post.liked')
  async handlePostLiked(payload: { senderId: number; postId: number }) {
    const post = await this.postRepo.findOne({ where: { id: payload.postId } });
    if (!post) return;

    await this.notificationService.create({
      type: NotificationType.POST_LIKED,
      senderId: payload.senderId,
      receiverId: post.userId,
      postId: payload.postId,
      message: 'liked your post',
    });
  }

  @OnEvent('post.commented')
  async handlePostCommented(payload: { senderId: number; postId: number }) {
    const post = await this.postRepo.findOne({ where: { id: payload.postId } });
    if (!post) return;

    await this.notificationService.create({
      type: NotificationType.POST_COMMENTED,
      senderId: payload.senderId,
      receiverId: post.userId,
      postId: payload.postId,
      message: 'commented on your post',
    });
  }

  @OnEvent('user.followed')
  async handleUserFollowed(payload: { senderId: number; receiverId: number }) {
    await this.notificationService.create({
      type: NotificationType.USER_FOLLOWED,
      senderId: payload.senderId,
      receiverId: payload.receiverId,
      message: 'started following you',
    });
  }
}
