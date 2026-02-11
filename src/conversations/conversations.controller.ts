import { Controller, Get, Delete, Param } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { MessagesService } from '../messages/messages.service';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Get()
  async getConversations() {
    const conversations = await this.conversationsService.findAll();

    return {
      conversations: conversations.map((conv) => ({
        phone: conv.phone,
        name: conv.name,
        lastMessage: conv.lastMessage,
        lastTimestamp: conv.lastTimestamp,
        unreadCount: conv.unreadCount,
      })),
    };
  }

  @Delete(':phone')
  async deleteConversation(@Param('phone') phone: string) {
    await this.messagesService.deleteByPhone(phone);
    await this.conversationsService.deleteByPhone(phone);

    return {
      status: 'success',
      message: 'Conversación eliminada',
    };
  }
}