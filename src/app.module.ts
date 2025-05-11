import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './modules/api/api.module';
import { Extension } from './modules/api/entities/extension.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Extension],
      synchronize: true, // Não usar em produção
    }),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
