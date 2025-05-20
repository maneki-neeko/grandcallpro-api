import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from '@core/entities/call-record.entity';
import { DashboardService } from './services/dashboard.service';
import { CallEventListenerService } from './services/call-event-listener.service';
import { DashboardGateway } from './gateways/dashboard.gateway';
import { DashboardController } from './controllers/dashboard.controller';
import { CoreModule } from '@core/core.module';
import { ApiModule } from '@api/api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallRecord]),
    CoreModule,
    ApiModule,
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
