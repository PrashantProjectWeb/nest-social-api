import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Req,
    Body,
    Param,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Get('post/:postId')
  async getCommentByPost(@Param('postId') postId: string) {
    return this.commentService.getCommentByPost(Number(postId));
  }

  @Post()
  @HttpCode(201)
  async createComment(@Req() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(req.user.id, createCommentDto);
  }

  @Put(':id')
  async updateComment(@Req() req, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(req.user.id, Number(id), updateCommentDto);
  }

  @Delete(':id')
  async deleteComment(@Req() req, @Param('id') id: string) {
    return this.commentService.deleteComment(req.user.id, Number(id));
  }
}
