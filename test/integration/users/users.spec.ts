import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { cleanupTestingModule, clearDatabase, createTestingModule, TestContext } from 'test/setup';
import UserLevel from '@users/entities/user-level';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { getToken } from '../utils';
import UserStatus from '@users/entities/user-status';

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

      const response = await request(context.httpServer)
        .post('/v1/users')
        .set({ authorization: token })
        .send(payload);

      expect(response.body.password).not.toBe('senha123');
      expect(response.body).toMatchObject({
        id: 2,
        name: 'Teste Usuario Dois',
        email: 'teste22@example.com',
        department: 'TI',
        role: 'developer',
        status: UserStatus.ACTIVE,
        level: UserLevel.USER,
        username: 'userexample22',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(response.status).toBe(HttpStatus.CREATED);
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

      const response = await request(context.httpServer)
        .post('/v1/users')
        .set({ authorization: token })
        .send(payload);

      expect(response.body).toMatchObject({
        error: 'Conflict',
        message: 'Email already exists',
        statusCode: 409,
      });

      expect(response.status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('PUT /v1/users/:id', () => {
    it('Deve atualizar um usuário com sucesso', async () => {
      const token = await getToken(context);

      const payload = {
        name: 'Teste Usuario Dois',
        username: 'userexample22',
        email: 'teste22@example.com',
        department: 'TI',
        role: 'developer',
      };

      const response = await request(context.httpServer)
        .put('/v1/users/1')
        .set({ authorization: token })
        .send(payload);

      expect(response.body).toMatchObject({
        id: 1,
        name: 'Teste Usuario Dois',
        email: 'teste22@example.com',
        department: 'TI',
        role: 'developer',
        status: UserStatus.ACTIVE,
        level: UserLevel.ADMIN,
        username: 'userexample22',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('Deve retornar um erro ao tentar atualizar o próprio level', async () => {
      const token = await getToken(context);

      const payload = {
        name: 'Teste Usuario Dois',
        username: 'userexample22',
        email: 'teste22@example.com',
        department: 'TI',
        role: 'developer',
        level: UserLevel.SUPERVISOR,
      };

      const response = await request(context.httpServer)
        .put('/v1/users/1')
        .set({ authorization: token })
        .send(payload);

      expect(response.body).toMatchObject({
        error: 'Forbidden',
        message: 'You cannot update your own level',
        statusCode: 403,
      });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });
});
