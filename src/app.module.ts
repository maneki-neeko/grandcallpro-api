import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './modules/api/api.module';
import { CoreModule } from './modules/core/core.module';
import { Extension } from './modules/api/entities/extension.entity';
import { CallRecord } from './modules/core/entities/call-record.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Extension, CallRecord],
      synchronize: true, // Não usar em produção
    }),
    ApiModule,
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
