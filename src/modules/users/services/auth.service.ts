import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthUserDto } from "@users/dto/auth-user.dto";
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from "@users/dto/register-user.dto";
import { User } from "@users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private static readonly USER_OR_PASSWORD_MISMATCH = 'Email or password does not match';

  async login(authUserDto: AuthUserDto) {
    const user = await this.usersService.findByEmail(authUserDto.email);

    if (!user) {
      throw new BadRequestException(AuthService.USER_OR_PASSWORD_MISMATCH);
    }

    const isPasswordMatch = await bcrypt.compare(authUserDto.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(AuthService.USER_OR_PASSWORD_MISMATCH);
    }

    return user;
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = Object.assign(new User(), {
      ...registerUserDto,
      password: await bcrypt.hash(registerUserDto.password, 10),
    });

    return this.usersService.create(user);
  }
}