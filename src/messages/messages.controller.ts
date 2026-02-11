import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ConversationsService } from '../conversations/conversations.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService,
  ) {}

  @Get(':phone')
  async getMessages(
    @Param('phone') phone: string,
    @Query('limit') limit?: string,
  ) {
    const messages = await this.messagesService.findByPhone(
      phone,
      limit ? parseInt(limit) : 50,
    );

    messages.reverse();

    await this.conversationsService.markAsRead(phone);

    return {
      messages: messages.map((msg) => ({
        id: msg._id,
        phone: msg.phone,
        name: msg.name,
        message: msg.message,
        timestamp: msg.timestamp,
        isFromBot: msg.isFromBot,
      })),
    };
  }
}