import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFileInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
