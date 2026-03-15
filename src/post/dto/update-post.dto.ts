import { IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
