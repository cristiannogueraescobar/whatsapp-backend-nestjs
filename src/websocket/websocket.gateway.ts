import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients = 0;

  handleConnection(client: Socket) {
    this.connectedClients++;
    console.log(`✅ Cliente conectado: ${client.id}`);
    console.log(`👥 Total clientes conectados: ${this.connectedClients}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients--;
    console.log(`❌ Cliente desconectado: ${client.id}`);
    console.log(`👥 Total clientes conectados: ${this.connectedClients}`);
  }

  broadcastNewMessage(message: any) {
    this.server.emit('message', message);
    console.log('📤 Mensaje enviado a todos los clientes:', message.data.phone);
  }
}