import { Exclude, Expose, Type } from 'class-transformer';

class PostUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

@Exclude()
export class PostResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  caption: string;

  @Expose()
  image: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => PostUserDto)
  user?: PostUserDto;
}
