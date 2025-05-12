import { AuthenticateMessages } from '@users/constants/messages';
import type { UserAuthenticationRequest } from '@users/controllers/dtos/UserAuthenticationRequest';
import { UserRepository } from '@users/repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from 'src/database';
import process from 'process';

export class AuthenticateUserUseCase {
  private usersRepository: UserRepository;
  private jwtSecret: string;

  constructor() {
    this.usersRepository = new UserRepository(AppDataSource);
    this.jwtSecret = process.env.JWT_SECRET || '';
  }

  async perform(credentials: UserAuthenticationRequest): Promise<any> {
    const { email, password } = credentials;

    // Busca o usuário pelo e-mail
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new Error(AuthenticateMessages.LOGIN_ERROR);
    }

    // Verifica se a senha está correta
    // const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = password === user.password;
    if (!passwordMatch) {
      throw new Error(AuthenticateMessages.LOGIN_ERROR);
    }

    // Gera um token JWT
    const token = jwt.sign({ userId: user.id }, this.jwtSecret, {
      expiresIn: '1h',
    });

    return { user, token };
  }
}
