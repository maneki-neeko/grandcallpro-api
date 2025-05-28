import UserLevel from '@users/entities/user-level';
import request from 'supertest';
import { TestContext } from 'test/setup';
import UserStatus from '@users/entities/user-status';
import { User } from '@users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export const getToken = async (context: TestContext) => {
  const userRepository = context.dataSource.getRepository(User);

  const user = Object.assign(new User(), {
    id: 1,
    name: 'Usuário Teste',
    email: 'teste@example.com',
    username: 'teste',
    department: 'TI',
    password: await bcrypt.hash('senha123', 10),
    role: 'developer',
    level: UserLevel.ADMIN,
    status: UserStatus.ACTIVE,
  });

  await userRepository.save(user);

  const authPayload = {
    login: 'teste',
    password: 'senha123',
  };

  const response = await request(context.httpServer).post('/v1/auth/login').send(authPayload);

  return `Bearer ${response.body.accessToken}`;
};
