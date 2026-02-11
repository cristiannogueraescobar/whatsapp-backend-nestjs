import { Controller, Post, Body } from '@nestjs/common';
import { WebhookMessageDto } from '../dto/webhook-message.dto';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Post()
  async receiveMessage(@Body() messageDto: WebhookMessageDto) {
    try {
      const timestamp = messageDto.timestamp
        ? new Date(messageDto.timestamp)
        : new Date();

      const message = await this.messagesService.create({
        phone: messageDto.phone,
        name: messageDto.name,
        message: messageDto.message,
        timestamp,
        isFromBot: false,
      });

      await this.conversationsService.updateOrCreate({
        phone: messageDto.phone,
        name: messageDto.name,
        lastMessage: messageDto.message,
        lastTimestamp: timestamp,
      });

      this.websocketGateway.broadcastNewMessage({
        type: 'new_message',
        data: {
          id: message._id.toString(),
          phone: message.phone,
          name: message.name,
          message: message.message,
          timestamp: message.timestamp,
          isFromBot: message.isFromBot,
        },
      });

      return {
        status: 'success',
        message: 'Mensaje recibido y procesado',
        id: message._id,
      };
    } catch (error) {
      console.error('Error procesando webhook:', error);
      throw error;
    }
  }
}