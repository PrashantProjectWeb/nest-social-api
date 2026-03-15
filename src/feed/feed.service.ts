import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entities';
import { Follower } from '../follower/entities/follower.entities';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(Follower)
    private followerRepo: Repository<Follower>,
  ) {}

  async getFeed(userId: number, page: number = 1, limit: number = 10) {
    // Get IDs of users the current user follows
    const following = await this.followerRepo.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
    const followingIds = following.map((f) => f.following.id);

    let followingPosts: any[] = [];
    let followingTotal = 0;

    // Fetch posts from followed users
    if (followingIds.length > 0) {
      const [posts, total] = await this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .loadRelationCountAndMap('post.likeCount', 'post.likes')
        .loadRelationCountAndMap('post.commentCount', 'post.comments')
        .where('post.userId IN (:...followingIds)', { followingIds })
        .orderBy('post.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      followingPosts = posts.map((p) => ({ ...p, source: 'following' }));
      followingTotal = total;
    }

    // If not enough following posts, backfill with trending
    const remaining = limit - followingPosts.length;
    let trendingPosts: any[] = [];

    if (remaining > 0) {
      const excludeIds = followingPosts.map((p) => p.id);

      const trendingQuery = this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .addSelect(
          '(SELECT COUNT(*) FROM "like" WHERE "like"."postId" = post.id) + ' +
          '(SELECT COUNT(*) FROM "comment" WHERE "comment"."postId" = post.id) * 2',
          'engagement_score',
        )
        .loadRelationCountAndMap('post.likeCount', 'post.likes')
        .loadRelationCountAndMap('post.commentCount', 'post.comments')
        .where("post.createdAt >= NOW() - INTERVAL '7 days'");

      // Exclude posts already in the following feed and user's own posts
      if (excludeIds.length > 0) {
        trendingQuery.andWhere('post.id NOT IN (:...excludeIds)', { excludeIds });
      }
      trendingQuery.andWhere('post.userId != :userId', { userId });

      const trending = await trendingQuery
        .orderBy('engagement_score', 'DESC')
        .take(remaining)
        .getMany();

      trendingPosts = trending.map((p) => ({ ...p, source: 'trending' }));
    }

    // Combine: following posts first, then trending
    const data = [...followingPosts, ...trendingPosts];
    const total = followingTotal + trendingPosts.length;

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
