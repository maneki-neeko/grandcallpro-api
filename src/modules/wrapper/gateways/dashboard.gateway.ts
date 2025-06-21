import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '@users/services/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/v1/dashboard',
})
export class DashboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(DashboardGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  async handleConnection(client: Socket) {
    // Tenta obter o token do objeto auth
    let token: string | undefined;

    // Verifica se existe um objeto auth com token no formato 'Bearer JWT'
    const authData = client.handshake.auth?.token;
    if (authData && typeof authData === 'string' && authData.startsWith('Bearer ')) {
      token = authData.split(' ')[1];
      this.logger.log('Token obtido do objeto auth');
    }

    // Se não encontrou no objeto auth, tenta obter do header de autorização
    if (!token) {
      token = client.handshake.headers['authorization']?.split(' ')[1];
      if (token) {
        this.logger.log('Token obtido do header de autorização');
      }
    }

    // Verifica se o token foi encontrado
    if (!token) {
      this.logger.warn(`Cliente sem token: ${client.id}`);
      client.disconnect();
      return;
    }

    const user = await this.authService.verifyUser(token);
    client.data['user'] = user;

    this.logger.log(`Cliente conectado: ${client.id}, usuário: ${user?.username}`);
    this.sendDashboardData(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  /**
   * Envia dados do dashboard para um cliente específico
   * @param client Socket do cliente
   */
  private async sendDashboardData(client: Socket) {
    try {
      const dashboardData = await this.dashboardService.view();
      client.emit('dashboard', dashboardData);
      this.logger.log(`Dados enviados para cliente ${client.id}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar dados: ${error.message}`, error.stack);
    }
  }

  /**
   * Envia atualizações do dashboard para todos os clientes conectados
   */
  async broadcastDashboardUpdate() {
    try {
      const dashboardData = await this.dashboardService.view();
      this.logger.log('Enviando atualização do dashboard para todos os clientes');
      this.server.emit('dashboard', dashboardData);
    } catch (error) {
      this.logger.error(`Erro ao enviar atualização: ${error.message}`, error.stack);
    }
  }
}
