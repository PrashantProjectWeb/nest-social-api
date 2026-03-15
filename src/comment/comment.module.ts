import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Post } from '../post/entities/post.entities';
import { Comment } from './entities/commententities';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
 imports: [TypeOrmModule.forFeature([Post, Comment])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
