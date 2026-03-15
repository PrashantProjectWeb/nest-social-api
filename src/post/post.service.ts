import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    async createPost(userId: number, createPostDto: CreatePostDto)
    {
        return true ;
    }


    async getPostsByUser(userId: number)
    {
        return true ;
    }

    async getPosts()
    {
        return true ;
    }

    async getPost(postId: number)
    {
        return true ;
    }
}
