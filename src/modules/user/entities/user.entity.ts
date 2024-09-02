import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { roles } from 'src/common/constants/roles.enum';
import { File } from 'src/modules/file/entities/file.entity';
import { FollowUserDto } from '../dto/follow-user.dto';
import { toTimestamp } from 'src/common/utils/ToTimestamp';

@ObjectType()
@Schema({
  timestamps: { createdAt: true, updatedAt: true },
})
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Field(() => File, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: File.name })
  profile_image?: File | Types.ObjectId;

  // @Field(() => String)
  @Prop({
    type: String,
    required: true,
    validators: { minlength: 8 },
    select: false,
  })
  password: string;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number })
  birth_date?: number;

  @Field(() => Number)
  @Prop({ type: Number })
  createdAt: number;

  @Field(() => Number)
  @Prop({ type: Number })
  updatedAt: number;

  @Field(() => roles)
  @Prop({ type: String, enum: roles, default: roles.USER })
  role: roles;

  @Field(() => [FollowUserDto])
  @Prop({
    type: [
      {
        followDate: { type: Number },
        user: { type: Types.ObjectId, ref: User.name },
      },
    ],
    default: [],
  })
  following: Types.Array<{ followDate: number; user: User }>;

  @Field(() => [FollowUserDto])
  @Prop({
    type: [
      {
        followDate: { type: Number },
        user: { type: Types.ObjectId, ref: User.name },
      },
    ],
    default: [],
  })
  followers: Types.Array<{ followDate: number; user: User }>;
}

// UserSchema.pre

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ name: 1 });
