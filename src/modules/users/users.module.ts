import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@users/entities/user.entity';
import { UsersController } from '@users/controllers/users.controller';
import { UsersService } from '@users/services/users.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from '@users/services/auth.service';
import { JwtStrategy } from '@users/strategies/jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'grandcallpro-secret-key', // Idealmente, use variáveis de ambiente
      signOptions: { expiresIn: '24h' },
    }),
    NotificationsModule, // importa notifications
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, JwtStrategy],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
