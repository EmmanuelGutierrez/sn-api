import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { Post } from '../../entities/post.entity';
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Message extends Document {
  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: Types.ObjectId, ref: User.name, default: [] })
  reactions: Types.Array<User>;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post: Post;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
