import { Injectable } from "@nestjs/common";
import { DashboardView } from "../dto/dashboard-view";

@Injectable()
export class DashboardService {
    async view(): Promise<DashboardView> {
        // 1. Consultar ultimas 5 chamadas
        // 2. Coletar o número do ramal de cada uma
        // 3. Fazer uma chamada para a API de ramais consultando informações de cada ramal (em massa)

        return {
            calls: [
                {
                    origin: {
                        department: 'Depto. Financeiro',
                        sector: 'Contabilidade',
                        subsector: 'Pagamentos',
                        employee: 'Ana Clara'
                    },
                    destiny: {
                        department: '-',
                        sector: '-',
                        subsector: '-',
                        employee: '-'
                    },
                    status: 'ATENDIDA',
                    timestamp: '15-04-25 10:32:04',
                    duration: '2s'
                },
                {
                    origin: {
                        department: 'Depto. Financeiro',
                        sector: 'Contabilidade',
                        subsector: 'Pagamentos',
                        employee: 'Ana Clara'
                    },
                    destiny: {
                        department: '-',
                        sector: '-',
                        subsector: '-',
                        employee: '-'
                    },
                    status: 'ATENDIDA',
                    timestamp: '15-04-25 10:32:01',
                    duration: '2s'
                },
            ]
        }
    }
}