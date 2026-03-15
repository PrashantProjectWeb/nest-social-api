import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LikeResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  postId: number;

  @Expose()
  createdAt: Date;
}
