import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostDataReturnDto {
  @Field(() => Number)
  page: number;

  @Field(() => Number)
  inThisPage: number;

  @Field(() => Number)
  total: number;

  @Field(() => [Post])
  data: Post[];
}
