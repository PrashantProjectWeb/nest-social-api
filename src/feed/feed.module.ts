import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Post } from '../post/entities/post.entities';
import { Follower } from '../follower/entities/follower.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Follower])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
