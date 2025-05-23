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
import UserStatus from '@users/entities/user-status';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_CREATED_EVENT } from 'src/modules/shared/events';
import UserLevel from '@users/entities/user-level';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async login(authUserDto: AuthUserDto): Promise<AuthResponse> {
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

    let accessToken = null;

    if (user.status == UserStatus.ACTIVE) {
      accessToken = this.jwtService.sign(payload);
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        status: user.status,
        email: user.email,
        level: user.level,
      },
      accessToken,
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

    this.eventEmitter.emit(USER_CREATED_EVENT, createdUser);

    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        status: createdUser.status,
        email: createdUser.email,
        level: createdUser.level,
      }
    };
  }
}
