import { Injectable } from '@nestjs/common';
import { Calls, DashboardView, ExtensionInfo } from '../dto/dashboard-view';
import { CallDataService } from '@core/services/call-data.service';
import { ExtensionService } from '@api/services/extension.service';
import { CallRecord } from '@core/entities/call-record.entity';
import { Extension } from '@api/entities/extension.entity';

@Injectable()
export class DashboardService {
  constructor(
    private readonly callDataService: CallDataService,
    private readonly extensionService: ExtensionService
  ) {}

  async view(): Promise<DashboardView> {
    const lastFiveCalls = await this.callDataService.findLastFiveCalls();
    const calls = await this.buildLastCalls(lastFiveCalls);

    return {
      cards: [
        {
          title: 'Total de Chamadas Hoje',
          content: '142',
          percentualDifference: '+12% em relação a ontem',
        },
        {
          title: 'Chamadas Perdidas',
          content: '8',
          percentualDifference: '-3% em relação a ontem',
        },
        {
          title: 'Duração Média',
          content: '2s',
          percentualDifference: '+30s em relação a ontem',
        },
      ],
      calls,
    };
  }

  private async buildLastCalls(lastFiveCalls: CallRecord[]): Promise<Calls[]> {
    const extensionsOrigin = lastFiveCalls.map(call => Number(call.src));
    const extensionsDestiny = lastFiveCalls.map(call => Number(call.dst));
    const extensions = [...new Set([...extensionsOrigin, ...extensionsDestiny])];

    const extensionsInfo = await this.extensionService.findByNumbers(extensions);

    return lastFiveCalls.map(call => {
      const origin = extensionsInfo.find(extension => extension.number === Number(call.src));
      const destiny = extensionsInfo.find(extension => extension.number === Number(call.dst));

      const status = call.disposition === 'ANSWERED' ? 'ATENDIDA' : 'NÃO ATENDIDA';
      
      return ({
        origin: this.buildExtensionInfo(Number(call.src), origin),
        destiny: this.buildExtensionInfo(Number(call.dst), destiny),
        status,
        timestamp: call.start,
        duration: call.duration.toString(),
      });
    });
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
