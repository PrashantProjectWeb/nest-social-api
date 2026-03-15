import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entities';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
    private eventEmitter: EventEmitter2
  ) {}

  async likePost(userId: number, postId: number) {
    const existing = await this.likeRepo.findOne({ where: { userId, postId } });
    if (existing) throw new ConflictException('Already liked');
    const like = this.likeRepo.create({ userId, postId });
    const savedLike = await this.likeRepo.save(like);
    this.eventEmitter.emit('post.liked', { senderId: userId, postId });
    return savedLike;
  }

  async unlikePost(userId: number, postId: number) {
    const result = await this.likeRepo.delete({ userId, postId });
    return { deleted: (result.affected ?? 0) > 0 };
  }

  async getLikesByPost(postId: number) {
    return this.likeRepo.find({ where: { postId }, relations: ['user'] });
  }
}
