import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { FollowDto } from './dto/follow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('follower')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post()
  @HttpCode(201)
  async follow(@Req() req, @Body() followDto: FollowDto) {
    return this.followerService.follow(req.user.id, followDto.followingId);
  }

  @Delete(':followingId')
  async unfollow(@Req() req, @Param('followingId') followingId: string) {
    return this.followerService.unfollow(req.user.id, Number(followingId));
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId') userId: string) {
    return this.followerService.getFollowers(Number(userId));
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId') userId: string) {
    return this.followerService.getFollowing(Number(userId));
  }

  @Get('count/:userId')
  async getFollowerCount(@Param('userId') userId: string) {
    return this.followerService.getFollowerCount(Number(userId));
  }
}
