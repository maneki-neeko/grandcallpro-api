import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '@users/services/auth.service';
import { AuthUserDto } from '@users/dto/auth-user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { AuthResponse } from '@users/dto/auth-response.interface';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Autentica um usuário e retorna um token JWT
   * @param authUserDto Credenciais do usuário (username ou email e senha)
   * @returns Token JWT de acesso
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authUserDto: AuthUserDto): Promise<AuthResponse> {
    return this.authService.login(authUserDto);
  }

  /**
   * Registra um novo usuário e retorna um token JWT
   * @param createUserDto Dados do novo usuário
   * @returns Token JWT de acesso
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.register(createUserDto);
  }
}
