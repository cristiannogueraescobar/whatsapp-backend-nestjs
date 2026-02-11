import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(messageData: {
    phone: string;
    name: string;
    message: string;
    timestamp: Date;
    isFromBot?: boolean;
  }): Promise<Message> {
    const createdMessage = new this.messageModel(messageData);
    return createdMessage.save();
  }

  async findByPhone(phone: string, limit: number = 50): Promise<Message[]> {
    return this.messageModel
      .find({ phone })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async deleteByPhone(phone: string): Promise<any> {
    return this.messageModel.deleteMany({ phone }).exec();
  }
}