import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginInputDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  public readonly username: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  public readonly password: string;
}
