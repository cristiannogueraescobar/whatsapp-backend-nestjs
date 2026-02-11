import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  _id: Types.ObjectId;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ default: false })
  isFromBot: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);