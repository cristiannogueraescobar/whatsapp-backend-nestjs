import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    MongooseModule.forRoot(process.env.MONGODB_URL || 'mongodb://localhost:27017/whatsapp_db'),
    
    WebhookModule,
    ConversationsModule,
    MessagesModule,
    WebsocketModule,
  ],
})
export class AppModule {}