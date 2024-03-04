import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Post extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    default: [],
  })
  reactions: Types.Array<User>;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
