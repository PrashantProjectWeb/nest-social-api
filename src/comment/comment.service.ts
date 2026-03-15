import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Post } from '../post/entities/post.entities';
import { Comment } from '../comment/entities/commententities';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Post)
        private postRepo: Repository<Post>,
        @InjectRepository(Comment)
        private commentRepo: Repository<Comment>,
        private eventEmitter: EventEmitter2,
    ) {}

  async getCommentByPost(postId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    const post = await this.postRepo.findOne({ where: { id: createCommentDto.postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const comment = this.commentRepo.create({
      content: createCommentDto.content,
      user: { id: userId },
      post: { id: createCommentDto.postId },
    });
    const savedComment = await this.commentRepo.save(comment);
    this.eventEmitter.emit('post.commented', { senderId: userId, postId: createCommentDto.postId });
    return savedComment;
  }

  async updateComment(userId: number, id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepo.findOne({ where: { id }, relations: ['user'] });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }
    await this.commentRepo.update(id, updateCommentDto);
    return await this.commentRepo.findOne({ where: { id } });
  }

  async deleteComment(userId: number, id: number) {
    const comment = await this.commentRepo.findOne({ where: { id }, relations: ['user'] });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentRepo.delete(id);
    return { message: 'Comment deleted' };
  }
}
