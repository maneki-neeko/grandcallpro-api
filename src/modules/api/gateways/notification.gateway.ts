import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { NotificationService } from '@api/services/notification.service';
import { User } from '@users/entities/user.entity';
import UserLevel from '@users/entities/user-level';
import { Notification } from '@api/entities/notification.entity';
import { NOTIFICATIONS_UPDATED_EVENT } from '@shared/events';
import { AuthService } from '@users/services/auth.service';

@WebSocketGateway({
  cors: true,
  namespace: '/v1/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers['authorization']?.split(' ')[1];
    if (!token) {
      this.logger.warn(`Cliente sem token: ${client.id}`);
      client.disconnect();
      return;
    }
    const user = await this.authService.verifyUser(token);
    client.data['user'] = user;

    this.logger.log(`Cliente conectado: ${client.id}, usuário: ${user?.username}`);
    this.sendNotificationData(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  private async sendNotificationData(client: Socket) {
    try {
      const user = client.data['user'];
      const notifications = await this.notificationService.findRecentNotifications();

      this.emitNotificationsByLevel(user, notifications, client);
      this.logger.log(`Dados enviados para cliente ${client.id}, usuário: ${user?.name}`);
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
      this.logger.log('Enviando notificações para clientes conectados');

      // Obter todos os clientes conectados ao namespace
      const connectedSockets = await this.server.fetchSockets();

      this.logger.log(`Total de ${connectedSockets.length} clientes conectados`);

      let notificationsCount = 0;

      // Para cada socket conectado, enviar notificações filtradas pelo nível do usuário
      for (const socket of connectedSockets) {
        const user = socket.data.user;
        if (user) {
          // Filtrar notificações pelo nível do usuário e enviar apenas para este cliente
          this.emitNotificationsByLevel(user, notifications, socket);
          notificationsCount++;
        } else {
          this.logger.warn(`Socket ${socket.id} não tem usuário associado`);
        }
      }

      this.logger.log(`Notificações enviadas para ${notificationsCount} usuários`);
    } catch (error) {
      this.logger.error(`Erro ao enviar atualização: ${error.message}`, error.stack);
    }
  }

  private emitNotificationsByLevel(
    user: User,
    notifications: Notification[],
    client: Socket | any
  ) {
    // Se não houver usuário ou cliente, não faz nada
    if (!user || !client) return;

    // Filtrar notificações por nível
    const notificationsByLevel = {
      [UserLevel.ADMIN]: notifications.filter(
        notification => notification.level === UserLevel.ADMIN
      ),
      [UserLevel.SUPERVISOR]: notifications.filter(
        notification => notification.level === UserLevel.SUPERVISOR
      ),
      [UserLevel.USER]: notifications.filter(notification => notification.level === UserLevel.USER),
    };

    // Obter notificações para o nível do usuário
    const userNotifications = notificationsByLevel[user.level];

    // Enviar notificações para o cliente
    // Verificamos se o cliente tem o método emit
    if (typeof client.emit === 'function') {
      // É um Socket normal
      client.emit('notifications', userNotifications);
    } else {
      // É um RemoteSocket do fetchSockets()
      this.server.to(client.id).emit('notifications', userNotifications);
    }

    this.logger.log(`Notificações enviadas para usuário ${user.name} (${user.level})`);
  }

  @OnEvent(NOTIFICATIONS_UPDATED_EVENT)
  async handleNotificationsUpdatedEvent() {
    await this.broadcastNotificationUpdate();
  }
}
