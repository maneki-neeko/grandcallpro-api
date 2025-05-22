import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from '../services/notification.service';

@WebSocketGateway({ namespace: '/v1/notifications', cors: true })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  async handleConnection(client: Socket) {
    // Autenticação JWT pode ser feita via middleware ou handshake
    // Supondo que userId está no handshake
    const userId = client.handshake.auth?.userId;
    if (userId) {
      const notifications = await this.notificationService.findByUser(userId);
      client.emit('notifications:list', notifications);
    }
  }

  handleDisconnect() {
    // Limpeza se necessário
  }

  @SubscribeMessage('notifications:markAsViewed')
  async markAsViewed(@MessageBody() data: { id: number }, @ConnectedSocket() client: Socket) {
    await this.notificationService.markAsViewed(data.id);
    client.emit('notifications:viewed', { id: data.id });
  }

  @SubscribeMessage('notifications:delete')
  async delete(@MessageBody() data: { id: number }, @ConnectedSocket() client: Socket) {
    await this.notificationService.delete(data.id);
    client.emit('notifications:deleted', { id: data.id });
  }
}
