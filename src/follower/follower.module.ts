import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';
import { Follower } from './entities/follower.entities';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follower, User])],
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
