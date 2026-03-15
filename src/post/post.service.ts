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

  async getPosts() {
    return this.postRepo.find({ relations: ['user'], order: { createdAt: 'DESC' } });
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
