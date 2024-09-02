import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class SubscriptionPostReturnDto {
  @Field(() => Post)
  post: Post;
}
