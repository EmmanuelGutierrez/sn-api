import { Field, InputType } from '@nestjs/graphql';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
//import { FileUpload } from 'src/common/models/file-upload.model';

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

  /* @Field(() => graphqlUploadExpress, { nullable: true })
  @IsString()
  @IsOptional()
  profile_image: Promise<FileUpload>; */

  @Field(() => Number, { nullable: true })
  @IsString()
  @IsOptional()
  birth_date: number;
}
