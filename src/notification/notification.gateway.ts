import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(`user-${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    // cleanup handled automatically by socket.io
  }

  sendToUser(userId: number, payload: any) {
    this.server.to(`user-${userId}`).emit('notification', payload);
  }
}
