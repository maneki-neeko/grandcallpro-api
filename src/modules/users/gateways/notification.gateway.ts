import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationService } from '../services/notification.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/v1/notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private notificationService: NotificationService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.sendNotificationData(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  /**
   * Envia dados do dashboard para um cliente específico
   * @param client Socket do cliente
   */
  private async sendNotificationData(client: Socket) {
    try {
      const notifications = await this.notificationService.findRecentNotifications();
      client.emit('notifications', notifications);
      this.logger.log(`Dados enviados para cliente ${client.id}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar dados: ${error.message}`, error.stack);
    }
  }

  /**
   * Envia atualizações do dashboard para todos os clientes conectados
   */
  async broadcastNotificationUpdate() {
    try {
      const notifications = await this.notificationService.findRecentNotifications();
      this.logger.log('Enviando atualização do dashboard para todos os clientes');
      this.server.emit('notifications', notifications);
    } catch (error) {
      this.logger.error(`Erro ao enviar atualização: ${error.message}`, error.stack);
    }
  }
}
