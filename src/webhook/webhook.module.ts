import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { MessagesModule } from '../messages/messages.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [MessagesModule, ConversationsModule, WebsocketModule],
  controllers: [WebhookController],
})
export class WebhookModule {}