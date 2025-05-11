import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecord } from './entities/call-record.entity';
import { CallDataController } from './controllers/call-data.controller';
import { CallDataService } from './services/call-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([CallRecord])],
  controllers: [CallDataController],
  providers: [CallDataService],
  exports: [CallDataService]
})
export class CoreModule {}
