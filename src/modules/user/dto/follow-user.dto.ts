import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { User } from '../entities/user.entity';
//import { FileUpload } from 'src/common/models/file-upload.model';

// @ObjectType()
// export class PartialUser extends PartialType(User) {}

@ObjectType()
export class FollowUserDto {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => User)
  user: User;

  @Field(() => Number)
  followDate: number;
}
