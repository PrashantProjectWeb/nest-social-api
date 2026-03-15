import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entities';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    const post = this.postRepo.create({ ...createPostDto, userId });
    return this.postRepo.save(post);
  }

  async getPosts(page: number = 1, limit: number = 10) {
    const [data, total] = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .loadRelationCountAndMap('post.likeCount', 'post.likes')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPost(postId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId }, relations: ['user'] });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async getPostsByUser(userId: number) {
    return this.postRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }
}
