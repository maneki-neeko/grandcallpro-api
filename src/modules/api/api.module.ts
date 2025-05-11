import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extension } from './entities/extension.entity';
import { ExtensionController } from './controllers/extension.controller';
import { ExtensionService } from './services/extension.service';

@Module({
  imports: [TypeOrmModule.forFeature([Extension])],
  controllers: [ExtensionController],
  providers: [ExtensionService],
  exports: [ExtensionService],
})
export class ApiModule {}
