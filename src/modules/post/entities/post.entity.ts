import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { postTypes } from 'src/common/constants/post-types.enum';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Post extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => postTypes)
  @Prop({ type: String, enum: postTypes, default: postTypes.POST })
  type: postTypes;

  @Field(() => String)
  @Prop({ type: String, required: true })
  title: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  body: string;

  @Field(() => [User])
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    default: [],
  })
  reactions: Types.Array<User>;

  @Field(() => [Post])
  @Prop({
    type: Types.ObjectId,
    ref: Post.name,
    default: [],
  })
  comments: Types.Array<Post>;

  @Field(() => [String])
  @Prop({ type: [String] })
  tags: string[];

  @Field(() => [String])
  @Prop({ type: [String] })
  images: string[];

  @Field(() => User)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
