import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from '@core/entities/call-record.entity';
import { DashboardService } from './services/dashboard.service';
import { CallEventListenerService } from './services/call-event-listener.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallRecord]),
  ],
  providers: [
    DashboardService,
    CallEventListenerService,
  ],
  exports: [
    DashboardService,
  ],
})
export class WrapperModule {}
