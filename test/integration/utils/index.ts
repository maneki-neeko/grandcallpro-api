import UserLevel from '@users/entities/user-level';
import supertest from 'supertest';
import { TestContext } from 'test/setup';

export const getToken = async (context: TestContext) => {
  const userData = {
    name: 'Teste Usuario',
    email: 'teste@example.com',
    department: 'TI',
    password: 'senha123',
    role: 'developer',
    level: UserLevel.USER,
  };

  const response = await supertest(context.httpServer)
    .post('/v1/auth/register')
    .send(userData)
    .expect(201);

  return `Bearer ${response.body.accessToken}`;
};
