import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { cleanupTestingModule, clearDatabase, createTestingModule, TestContext } from 'test/setup';
import UserLevel from '@users/entities/user-level';
import supertest from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { getToken } from '../utils';

describe('Extensions Controller (e2e)', () => {
  let context: TestContext;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    context = await createTestingModule();
    userRepository = context.dataSource.getRepository(User);
  });

  afterAll(async () => {
    await cleanupTestingModule(context);
  });

  beforeEach(async () => {
    await clearDatabase(context.dataSource);
  });

  describe('POST /v1/extensions', () => {
    it('Deve criar um novo ramal com sucesso', async () => {
      const token = await getToken(context);

      const payload = {
        number: 302,
        department: 'Departamento',
        sector: 'Setor',
        employee: 'Ana Clara',
      };

      const response = await supertest(context.httpServer)
        .post('/v1/extensions')
        .set({ authorization: token })
        .send(payload)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        id: 1,
        number: 302,
        department: 'Departamento',
        sector: 'Setor',
        employee: 'Ana Clara',
      });
    });

    it('Não deve ser possível criar um ramal já existente', async () => {
      const token = await getToken(context);

      const payload = {
        number: 302,
        department: 'Departamento',
        sector: 'Setor',
        employee: 'Ana Clara',
      };

      await supertest(context.httpServer)
        .post('/v1/extensions')
        .set({ authorization: token })
        .send(payload);

      await supertest(context.httpServer)
        .post('/v1/extensions')
        .set({ authorization: token })
        .send(payload)
        .expect(HttpStatus.CONFLICT);
    });
  });
});
