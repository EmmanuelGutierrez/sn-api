import { IsNotEmpty, IsString } from 'class-validator';

export class CommentPostDto {
  @IsNotEmpty()
  @IsString()
  body: string;
}
