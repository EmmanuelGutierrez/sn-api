import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
