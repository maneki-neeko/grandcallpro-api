import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './modules/api/api.module';
import { CoreModule } from './modules/core/core.module';
import { UsersModule } from './modules/users/users.module';
import { Extension } from './modules/api/entities/extension.entity';
import { CallRecord } from './modules/core/entities/call-record.entity';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'src/database/database.sqlite',
      entities: [Extension, CallRecord, User],
      synchronize: true, // Não usar em produção
    }),
    ApiModule,
    CoreModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
