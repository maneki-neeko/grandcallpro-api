import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from '@core/entities/call-record.entity';
import { DashboardService } from './services/dashboard.service';
import { CallEventListenerService } from './services/call-event-listener.service';
import { DashboardGateway } from './gateways/dashboard.gateway';
import { DashboardController } from './controllers/dashboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallRecord]),
  ],
  controllers: [
    DashboardController,
  ],
  providers: [
    DashboardService,
    CallEventListenerService,
    DashboardGateway,
  ],
  exports: [
    DashboardService,
    DashboardGateway,
  ],
})
export class WrapperModule {}
