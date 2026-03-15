import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follower } from './entities/follower.entities';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FollowerService {
  constructor(
    @InjectRepository(Follower)
    private followerRepo: Repository<Follower>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async follow(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new ConflictException('You cannot follow yourself');
    }
    const user = await this.userRepo.findOne({ where: { id: followingId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existing = await this.followerRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (existing) {
      throw new ConflictException('Already following this user');
    }
    const follow = this.followerRepo.create({
      follower: { id: followerId },
      following: { id: followingId },
    });
    await this.followerRepo.save(follow);
    return { message: 'Followed successfully' };
  }

  async unfollow(followerId: number, followingId: number) {
    const existing = await this.followerRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (!existing) {
      throw new NotFoundException('You are not following this user');
    }
    await this.followerRepo.delete(existing.id);
    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId: number) {
    const followers = await this.followerRepo.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
    return followers.map((f) => f.follower);
  }

  async getFollowing(userId: number) {
    const following = await this.followerRepo.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
    return following.map((f) => f.following);
  }

  async getFollowerCount(userId: number) {
    const followerCount = await this.followerRepo.count({
      where: { following: { id: userId } },
    });
    const followingCount = await this.followerRepo.count({
      where: { follower: { id: userId } },
    });
    return { followerCount, followingCount };
  }
}
