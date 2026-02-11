import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastMessage: string;

  @Prop({ required: true })
  lastTimestamp: Date;

  @Prop({ default: 0 })
  unreadCount: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);