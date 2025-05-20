import { Injectable, Logger } from '@nestjs/common';
import { Calls, CallStatus, Card, DashboardView, ExtensionInfo } from '../dto/dashboard-view';
import { CallDataService } from '@core/services/call-data.service';
import { ExtensionService } from '@api/services/extension.service';
import { CallRecord } from '@core/entities/call-record.entity';
import { Extension } from '@api/entities/extension.entity';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly callDataService: CallDataService,
    private readonly extensionService: ExtensionService,
  ) {
  }

  async view(): Promise<DashboardView> {
    const lastFiveCalls = await this.callDataService.findLastFiveCalls();
    const cards = await this.buildCards();
    const calls = await this.buildLastCalls(lastFiveCalls);

    return {
      cards,
      calls,
    };
  }

  private async buildCallsDifferenceCard(): Promise<Card> {
    const totalCallsOfToday = await this.callDataService.findTotalCallsOfToday();
    const totalCallsOfYesterday = await this.callDataService.findTotalCallsOfYesterday();

    const totalCallsToday: Card = {
      title: 'Total de Chamadas Hoje',
      content: totalCallsOfToday.toString(),
      percentualDifference: 'Sem dados',
    }

    if (totalCallsOfYesterday > 0) {
      const percentual = `${((totalCallsOfToday - totalCallsOfYesterday) / totalCallsOfYesterday) * 100}%`
      totalCallsToday.percentualDifference = `${percentual} em relação a ontem`;
    }

    return totalCallsToday;
  }

  private async buildLostCallsDifferenceCard(): Promise<Card> {
    const totalLostCallsOfToday = await this.callDataService.findTotalLostCallsOfToday();
    const totalLostCallsOfYesterday = await this.callDataService.findTotalLostCallsOfYesterday();

    const totalLostCalls: Card = {
      title: 'Chamadas Perdidas',
      content: totalLostCallsOfToday.toString(),
      percentualDifference: 'Sem dados',
    }

    if (totalLostCallsOfYesterday > 0) {
      const percentual = `${((totalLostCallsOfToday - totalLostCallsOfYesterday) / totalLostCallsOfYesterday) * 100}%`
      totalLostCalls.percentualDifference = `${percentual} em relação a ontem`;
    }

    return totalLostCalls;
  }

  private async buildCards(): Promise<Card[]> {
    const totalCallsToday = await this.buildCallsDifferenceCard();
    const totalLostCalls = await this.buildLostCallsDifferenceCard();

    return [
      totalCallsToday,
      totalLostCalls,
    ];
  }

  private async buildLastCalls(lastFiveCalls: CallRecord[]): Promise<Calls[]> {
    const extensionsOrigin = lastFiveCalls.map(call => Number(call.src));
    const extensionsDestiny = lastFiveCalls.map(call => Number(call.dst));
    const extensions = [...new Set([...extensionsOrigin, ...extensionsDestiny])];

    const extensionsInfo = await this.extensionService.findByNumbers(extensions);

    return lastFiveCalls.map(call => {
      const origin = extensionsInfo.find(extension => extension.number === Number(call.src));
      const destiny = extensionsInfo.find(extension => extension.number === Number(call.dst));

      const answered = call.disposition === 'ANSWERED';
      const status = answered ? CallStatus.ATENDIDA : CallStatus.NAO_ATENDIDA;
      
      return ({
        origin: this.buildExtensionInfo(Number(call.src), origin),
        destiny: this.buildExtensionInfo(Number(call.dst), destiny),
        status: { value: status, answered },
        timestamp: call.start,
        duration: this.formatDuration(call.duration),
      });
    });
  }

  private formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private buildExtensionInfo(value: number, extension: Extension): ExtensionInfo {
    if (!extension) {
      return {
        value: value.toString(),
      };
    }

    return {
      value: value.toString(),
      options: {
        department: extension.department || '',
        sector: extension.sector || '',
        employee: extension.employee || '',
      },
    };
  }
}
