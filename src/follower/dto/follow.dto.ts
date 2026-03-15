import { IsInt, IsNotEmpty } from 'class-validator';

export class FollowDto {
  @IsInt()
  @IsNotEmpty()
  followingId: number;
}
