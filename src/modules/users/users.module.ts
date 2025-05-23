import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@users/entities/user.entity';
import { UsersController } from '@users/controllers/users.controller';
import { UsersService } from '@users/services/users.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from '@users/services/auth.service';
import { JwtStrategy } from '@users/strategies/jwt.strategy';
import { NotificationsModule } from '../api/notifications/notifications.module';
import { WrapperModule } from '../wrapper/wrapper.module';
import { UsersEventListenerService } from './services/users-event-listener.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'grandcallpro-secret-key', // Idealmente, use variáveis de ambiente
      signOptions: { expiresIn: '24h' },
    }),
    NotificationsModule, // importa notifications
    WrapperModule, // importa wrapper para acessar DashboardGateway
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, JwtStrategy, UsersEventListenerService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
