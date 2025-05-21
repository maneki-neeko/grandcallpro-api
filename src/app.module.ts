import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '@api/api.module';
import { CoreModule } from '@core/core.module';
import { UsersModule } from '@users/users.module';
import { Extension } from '@api/entities/extension.entity';
import { CallRecord } from '@core/entities/call-record.entity';
import { User } from '@users/entities/user.entity';
import { NotificationsModule } from './modules/notifications/notifications.module';

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
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
