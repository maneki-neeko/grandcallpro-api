import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DashboardService } from '../services/dashboard.service';
import { WsJwtGuard } from '@users/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/v1/dashboard',
})
@UseGuards(WsJwtGuard)
export class DashboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(DashboardGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private dashboardService: DashboardService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
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
