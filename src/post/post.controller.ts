import { Controller , UseGuards, Post, Body, HttpCode, Req, Get, Param} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostService } from '../post/post.service';
import { CreatePostDto } from '../post/dto/create-post.dto';


@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
   constructor(private readonly postService: PostService) {}
   
    @Post()
    @HttpCode(201)
     async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
      const userId = req.user.id;
      return this.postService.createPost(userId, createPostDto);
    }

    @Get()
    @HttpCode(200)
    async getPosts(@Req() req){
       return this.postService.getPosts();
    }

    @Get(':id')
    @HttpCode(200)
    async getPost(@Req() req, @Param('id') id: string){
        return this.postService.getPost(Number(id));    
    }

    @Get()
    @HttpCode(200)
    async getPostsByUser(@Req() req){
       return this.postService.getPostsByUser(req.user.id);
    }

}
