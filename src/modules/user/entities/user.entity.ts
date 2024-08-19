import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { roles } from 'src/common/constants/roles.enum';
import { File } from 'src/modules/file/entities/file.entity';

@ObjectType()
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
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

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    validators: { minlength: 8 },
    select: false,
  })
  password: string;

  @Field(() => Number, { nullable: true })
  @Prop({ type: Number })
  birth_date: number;

  @Field(() => roles)
  @Prop({ type: String, enum: roles, default: roles.USER })
  role: roles;

  @Field(() => [User])
  @Prop({ type: Types.ObjectId, ref: User.name, default: [] })
  following: Types.Array<User>;

  @Field(() => [User])
  @Prop({ type: Types.ObjectId, ref: User.name, default: [] })
  followers: Types.Array<User>;
}

export const UserSchema = SchemaFactory.createForClass(User);
