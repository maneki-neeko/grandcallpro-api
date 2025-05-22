import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { AuthUserDto } from '@users/dto/auth-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { User } from '@users/entities/user.entity';
import { AuthResponse } from '@users/dto/auth-response.interface';
import { JwtPayload } from '@users/dto/jwt-payload.interface';
import { USER_OR_PASSWORD_MISMATCH } from '../constants';
import { NotificationService } from '../../notifications/services/notification.service';
import UserStatus from '@users/entities/user-status';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService // injetar service
  ) {}

  async login(authUserDto: AuthUserDto): Promise<AuthResponse> {
    // Permitir login com username OU email
    const user = await this.usersService.findByLogin(authUserDto.login);

    if (!user) {
      throw new BadRequestException(USER_OR_PASSWORD_MISMATCH);
    }

    const isPasswordMatch = await bcrypt.compare(authUserDto.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(USER_OR_PASSWORD_MISMATCH);
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      level: user.level,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        status: user.status,
        email: user.email,
        level: user.level,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    const user = Object.assign(new User(), {
      ...registerUserDto,
      status: UserStatus.PENDING,
      password: await bcrypt.hash(registerUserDto.password, 10),
    });

    const createdUser = await this.usersService.create(user);

    const payload: JwtPayload = {
      sub: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      level: createdUser.level,
    };

    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        status: createdUser.status,
        email: createdUser.email,
        level: createdUser.level,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
