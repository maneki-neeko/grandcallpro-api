import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationService } from '@api/services/notification.service';
import { WsJwtGuard } from '@users/guards/ws-jwt.guard';
import { WsCurrentUser } from '@users/decorators/ws-current-user.decorator';
import { User } from '@users/entities/user.entity';
import UserLevel from '@users/entities/user-level';
import { Notification } from '@api/entities/notification.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/v1/notifications',
})
@UseGuards(WsJwtGuard)
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private notificationService: NotificationService) {}

  handleConnection(client: Socket) {
    const user = client['user'];
    this.logger.log(`Cliente conectado: ${client.id}, usuário: ${user?.name || 'desconhecido'}`);
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
      const user = client['user'];
      const notifications = await this.notificationService.findRecentNotifications();

      this.emitNotificationsByLevel(user, notifications, client);
      this.logger.log(`Dados enviados para cliente ${client.id}, usuário: ${user?.name}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar dados: ${error.message}`, error.stack);
    }
  }

  private emitNotificationsByLevel(user: User, notifications: Notification[], client: Socket) {
    const notification = {
      [UserLevel.ADMIN]: notifications.filter(
        notification => notification.level === UserLevel.ADMIN
      ),
      [UserLevel.SUPERVISOR]: notifications.filter(
        notification => notification.level === UserLevel.SUPERVISOR
      ),
      [UserLevel.USER]: notifications.filter(notification => notification.level === UserLevel.USER),
    };

    const userNotifications = notification[user.level];

    client.emit('notifications', userNotifications);
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

  /**
   * Exemplo de método que recebe mensagens do cliente e usa o decorator WsCurrentUser
   */
  @SubscribeMessage('mark_as_read')
  async markNotificationAsRead(
    @MessageBody() notificationId: number,
    @ConnectedSocket() client: Socket,
    @WsCurrentUser() user: User
  ) {
    this.logger.log(`Marcando notificação ${notificationId} como lida pelo usuário ${user.name}`);
    // Implementar lógica para marcar notificação como lida
    return { success: true };
  }
}
