import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { roles } from 'src/common/constants/roles.enum';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    validators: { minlength: 8 },
    select: false,
  })
  password: string;

  @Prop({ type: String })
  profile_image: string;

  @Prop({ type: Date })
  birth_date: Date;

  @Prop({ type: String, enum: roles, default: roles.USER })
  role: roles;

  @Prop({ type: Types.ObjectId, ref: User.name, default: [] })
  following: Types.Array<User>;

  @Prop({ type: Types.ObjectId, ref: User.name, default: [] })
  followers: Types.Array<User>;
}

export const UserSchema = SchemaFactory.createForClass(User);
