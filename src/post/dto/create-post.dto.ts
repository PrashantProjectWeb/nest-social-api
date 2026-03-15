import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsString()
  @IsOptional()
  image?: string;
}
