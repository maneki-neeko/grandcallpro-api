import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@users/users.module';
import { Extension } from '@api/entities/extension.entity';
import { Notification } from '@api/entities/notification.entity';
import { ExtensionController } from '@api/controllers/extension.controller';
import { ExtensionService } from '@api/services/extension.service';
import { NotificationService } from '@api/services/notification.service';
import { NotificationEventListenerService } from '@api/services/notification-event-listener.service';
import { NotificationGateway } from '@api/gateways/notification.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Extension, Notification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
  ],
  controllers: [ExtensionController],
  providers: [
    ExtensionService,
    NotificationService,
    NotificationEventListenerService,
    NotificationGateway,
  ],
  exports: [ExtensionService, NotificationService],
})
export class ApiModule {}
