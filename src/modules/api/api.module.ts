import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extension } from '@api/entities/extension.entity';
import { ExtensionController } from '@api/controllers/extension.controller';
import { ExtensionService } from '@api/services/extension.service';

@Module({
  imports: [TypeOrmModule.forFeature([Extension])],
  controllers: [ExtensionController],
  providers: [ExtensionService],
  exports: [ExtensionService],
})
export class ApiModule {}
