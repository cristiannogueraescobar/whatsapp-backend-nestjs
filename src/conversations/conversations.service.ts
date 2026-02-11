import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument } from '../schemas/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async updateOrCreate(data: {
    phone: string;
    name: string;
    lastMessage: string;
    lastTimestamp: Date;
  }): Promise<Conversation> {
    return this.conversationModel
      .findOneAndUpdate(
        { phone: data.phone },
        {
          $set: {
            name: data.name,
            lastMessage: data.lastMessage,
            lastTimestamp: data.lastTimestamp,
          },
          $inc: { unreadCount: 1 },
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  async findAll(): Promise<Conversation[]> {
    return this.conversationModel
      .find()
      .sort({ lastTimestamp: -1 })
      .exec();
  }

  async markAsRead(phone: string): Promise<any> {
    return this.conversationModel
      .updateOne({ phone }, { $set: { unreadCount: 0 } })
      .exec();
  }

  async deleteByPhone(phone: string): Promise<any> {
    return this.conversationModel.deleteOne({ phone }).exec();
  }
}