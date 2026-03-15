import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entities';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
  ) {}

  async likePost(userId: number, postId: number) {
    const existing = await this.likeRepo.findOne({ where: { userId, postId } });
    if (existing) throw new ConflictException('Already liked');
    const like = this.likeRepo.create({ userId, postId });
    return this.likeRepo.save(like);
  }

  async unlikePost(userId: number, postId: number) {
    const result = await this.likeRepo.delete({ userId, postId });
    return { deleted: (result.affected ?? 0) > 0 };
  }

  async getLikesByPost(postId: number) {
    return this.likeRepo.find({ where: { postId }, relations: ['user'] });
  }
}
