import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from '@core/entities/call-record.entity';
import { CallDataController } from '@core/controllers/call-data.controller';
import { CallDataService } from '@core/services/call-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([CallRecord])],
  controllers: [CallDataController],
  providers: [CallDataService],
  exports: [CallDataService],
})
export class CoreModule {}
