import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  profile_image: string;

  @Field(() => Number, { nullable: true })
  @IsString()
  @IsOptional()
  birth_date: number;
}
