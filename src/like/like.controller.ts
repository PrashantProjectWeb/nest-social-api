import { Controller, Post, Delete, Get, Param, Req, UseGuards, HttpCode } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  @HttpCode(201)
  async likePost(@Req() req, @Param('postId') postId: string) {
    return this.likeService.likePost(req.user.id, Number(postId));
  }

  @Delete(':postId')
  @HttpCode(200)
  async unlikePost(@Req() req, @Param('postId') postId: string) {
    return this.likeService.unlikePost(req.user.id, Number(postId));
  }

  @Get('post/:postId')
  @HttpCode(200)
  async getLikesByPost(@Param('postId') postId: string) {
    return this.likeService.getLikesByPost(Number(postId));
  }
}
