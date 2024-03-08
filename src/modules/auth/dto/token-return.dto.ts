import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenReturnDto {
  @Field(() => String)
  public readonly token: string;
}
