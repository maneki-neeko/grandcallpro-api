import { Controller, Get, Logger } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { DashboardView } from '../dto/dashboard-view';

@Controller('dashboard')
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private dashboardService: DashboardService) {}

  /**
   * Endpoint para obter os dados do dashboard
   * @returns Dados do dashboard
   */
  @Get()
  async getDashboardData(): Promise<DashboardView> {
    this.logger.log('Solicitação HTTP para obter dados do dashboard');
    return await this.dashboardService.view();
  }
}
