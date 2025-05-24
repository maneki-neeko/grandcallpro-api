import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ApiModule } from '@api/api.module';
import { CoreModule } from '@core/core.module';
import { UsersModule } from '@users/users.module';
import { WrapperModule } from './modules/wrapper/wrapper.module';
import { Extension } from '@api/entities/extension.entity';
import { Notification } from '@api/entities/notification.entity';
import { CallRecord } from '@core/entities/call-record.entity';
import { User } from '@users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'src/database/database.sqlite',
      entities: [Extension, Notification, CallRecord, User],
      synchronize: true, // Não usar em produção
    }),
    EventEmitterModule.forRoot(),
    ApiModule,
    CoreModule,
    UsersModule,
    WrapperModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
