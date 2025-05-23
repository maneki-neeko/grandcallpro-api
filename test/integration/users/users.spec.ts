import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { cleanupTestingModule, clearDatabase, createTestingModule, TestContext } from 'test/setup';
import UserLevel from '@users/entities/user-level';
import supertest from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { getToken } from '../utils';

describe('Users Controller (e2e)', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestingModule();
  });

  afterAll(async () => {
    await cleanupTestingModule(context);
  });

  beforeEach(async () => {
    await clearDatabase(context.dataSource);
  });

  describe('POST /v1/users', () => {
    it('Deve criar um novo usuário com sucesso', async () => {
      const token = await getToken(context);

      const payload = {
        name: 'Teste Usuario Dois',
        username: 'userexample22',
        email: 'teste22@example.com',
        department: 'TI',
        password: 'senha123',
        role: 'developer',
        level: UserLevel.USER,
      };

      const response = await supertest(context.httpServer)
        .post('/v1/users')
        .set({ authorization: token })
        .send(payload)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        id: 2,
        name: 'Teste Usuario Dois',
        email: 'teste22@example.com',
        department: 'TI',
        password: 'senha123',
        role: 'developer',
        level: UserLevel.USER,
      });
    });

    it('Não deve ser possível criar um usuário já existente', async () => {
      const token = await getToken(context);

      const payload = {
        name: 'Teste Usuario',
        username: 'userexample',
        email: 'teste@example.com',
        department: 'TI',
        password: 'senha123',
        role: 'developer',
        level: UserLevel.USER,
      };

      await supertest(context.httpServer)
        .post('/v1/users')
        .set({ authorization: token })
        .send(payload)
        .expect(HttpStatus.CONFLICT);
    });
  });
});
