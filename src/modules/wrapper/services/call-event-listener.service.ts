import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from '../gateways/dashboard.gateway';

@Injectable()
export class CallEventListenerService {
  private readonly logger = new Logger(CallEventListenerService.name);

  constructor(
    private dashboardGateway: DashboardGateway
  ) {}

  @OnEvent('call.recorded')
  async handleCallRecordedEvent() {
    try {
      await this.dashboardGateway.broadcastDashboardUpdate();
    } catch (error) {
      this.logger.error(`Erro ao processar evento de chamada: ${error.message}`, error.stack);
    }
  }
}
