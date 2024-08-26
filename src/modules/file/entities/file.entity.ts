import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@ObjectType()
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class File {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  asset_id: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  public_id: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  format: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  resource_type: string;

  @Field(() => Number)
  @Prop({ type: Number, required: true })
  bytes: number;

  @Field(() => String)
  @Prop({ type: String, required: true })
  url: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  secure_url: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  folder: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  original_filename: string;

  @Field(() => Number)
  @Prop({ type: Number })
  createdAt: number;

  @Field(() => Number)
  @Prop({ type: Number })
  updatedAt: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
