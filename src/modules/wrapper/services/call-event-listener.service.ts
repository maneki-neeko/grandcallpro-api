import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DashboardService } from './dashboard.service';

@Injectable()
export class CallEventListenerService {
  private readonly logger = new Logger(CallEventListenerService.name);

  constructor(
    private dashboardService: DashboardService
  ) {}

  @OnEvent('call.recorded')
  async handleCallRecordedEvent(callId: number) {
    this.logger.log(`Novo registro de chamada recebido: ${callId}`);
    
    try {
      await this.dashboardService.view();

      // TODO: Enviar dados via WebSocket
    } catch (error) {
      this.logger.error(`Erro ao processar evento de chamada: ${error.message}`, error.stack);
    }
  }
}
