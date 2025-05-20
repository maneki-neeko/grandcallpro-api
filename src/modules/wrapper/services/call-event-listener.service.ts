import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DashboardGateway } from '../gateways/dashboard.gateway';

@Injectable()
export class CallEventListenerService {
  private readonly logger = new Logger(CallEventListenerService.name);
  
  // Configurações para o mecanismo de retry
  private readonly maxRetries = 3;
  private readonly initialDelayMs = 1000; // 1 segundo
  private readonly maxDelayMs = 10000; // 10 segundos

  constructor(
    private dashboardGateway: DashboardGateway
  ) {}

  @OnEvent('call.recorded')
  async handleCallRecordedEvent() {
    await this.retryWithBackoff(
      () => this.dashboardGateway.broadcastDashboardUpdate(),
      this.maxRetries,
      this.initialDelayMs
    );
  }

  /**
   * Executa uma função com retry e backoff exponencial
   * @param fn Função a ser executada
   * @param maxRetries Número máximo de tentativas
   * @param delayMs Tempo de espera inicial entre tentativas (ms)
   * @param attempt Tentativa atual (usado internamente)
   */
  private async retryWithBackoff(
    fn: () => Promise<any>,
    maxRetries: number,
    delayMs: number,
    attempt = 1
  ): Promise<any> {
    try {
      return await fn();
    } catch (error) {
      if (attempt > maxRetries) {
        this.logger.error(
          `Falha após ${maxRetries} tentativas: ${error.message}`,
          error.stack
        );
        throw error;
      }

      // Calcular o próximo delay com jitter (variação aleatória)
      const nextDelay = Math.min(
        delayMs * Math.pow(2, attempt - 1) * (0.5 + Math.random()),
        this.maxDelayMs
      );

      this.logger.warn(
        `Tentativa ${attempt} falhou: ${error.message}. Tentando novamente em ${Math.round(nextDelay)}ms...`
      );

      // Esperar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, nextDelay));

      // Tentar novamente com backoff
      return this.retryWithBackoff(fn, maxRetries, delayMs, attempt + 1);
    }
  }
}
