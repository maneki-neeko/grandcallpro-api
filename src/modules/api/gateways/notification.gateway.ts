import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Inject, Injectable, Logger, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Server, Socket } from 'socket.io';
import { NotificationService } from '@api/services/notification.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/services/users.service';
import { JwtPayload } from '@users/dto/jwt-payload.interface';
import { WsJwtGuard } from '@users/guards/ws-jwt.guard';
import { WsCurrentUser } from '@users/decorators/ws-current-user.decorator';
import { User } from '@users/entities/user.entity';
import UserLevel from '@users/entities/user-level';
import { Notification } from '@api/entities/notification.entity';
import { NOTIFICATIONS_UPDATED_EVENT } from '@shared/events';

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

  constructor(
    private notificationService: NotificationService,
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async handleConnection(client: Socket) {
    this.logger.log(`NotificationGateway: Cliente conectado: ${client.id}`);
    
    try {
      // Já que o WsJwtGuard não está sendo executado, vamos autenticar manualmente
      const token = this.extractTokenFromHeader(client);
      
      if (!token) {
        this.logger.warn(`Cliente ${client.id} sem token JWT. Desconectando...`);
        this.logger.warn('Handshake auth:', JSON.stringify(client.handshake?.auth || {}));
        this.logger.warn('Handshake headers:', JSON.stringify(client.handshake?.headers || {}));
        client.disconnect(true);
        return;
      }
      
      this.logger.log('Token encontrado, verificando...');
      
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);
        this.logger.log(`Token válido para usuário ID: ${payload.sub}`);
        
        // Buscar o usuário
        const user = await this.usersService.findOne(payload.sub);
        
        if (!user) {
          this.logger.warn(`Usuário ID ${payload.sub} não encontrado`);
          client.disconnect(true);
          return;
        }
        
        this.logger.log(`Usuário autenticado: ${user.name} (${user.level})`);
        
        // Anexar o usuário ao objeto de cliente para uso posterior
        client['user'] = user;
        
        // Enviar dados iniciais
        this.sendNotificationData(client);
      } catch (jwtError) {
        this.logger.error(`Erro na verificação do token: ${jwtError.message}`);
        client.disconnect(true);
      }
    } catch (err) {
      this.logger.error(`Erro de autenticação: ${err.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

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
        const user = socket['user'];
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

  private emitNotificationsByLevel(user: User, notifications: Notification[], client: Socket | any) {
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
      [UserLevel.USER]: notifications.filter(
        notification => notification.level === UserLevel.USER
      ),
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
  
  private extractTokenFromHeader(client: Socket): string | undefined {
    // Extrair o token do handshake auth ou dos headers
    this.logger.log('Extraindo token do handshake...');
    
    // Verificar diferentes formatos de token no handshake
    let token: string | undefined;
    
    // 1. Verificar em client.handshake.auth.token
    if (client.handshake?.auth?.token) {
      this.logger.log('Token encontrado em handshake.auth.token');
      token = client.handshake.auth.token;
      // Se o token já tiver o formato Bearer, extrair apenas o token
      if (token.startsWith('Bearer ')) {
        token = token.substring(7);
      }
      return token;
    }
    
    // 2. Verificar em client.handshake.headers.authorization
    const authorization = client.handshake?.headers?.authorization;
    if (authorization) {
      this.logger.log('Token encontrado em handshake.headers.authorization');
      // Formato padrão: 'Bearer <token>'
      const [type, authToken] = authorization.split(' ');
      if (type === 'Bearer' && authToken) {
        return authToken;
      }
    }
    
    // 3. Verificar em client.handshake.query.token (formato alternativo)
    if (client.handshake?.query?.token) {
      this.logger.log('Token encontrado em handshake.query.token');
      return client.handshake.query.token as string;
    }
    
    this.logger.warn('Nenhum token encontrado no handshake');
    return undefined;
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
