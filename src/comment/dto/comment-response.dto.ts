import { Exclude, Expose, Type } from 'class-transformer';

class CommentUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

@Exclude()
export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => CommentUserDto)
  user?: CommentUserDto;
}
