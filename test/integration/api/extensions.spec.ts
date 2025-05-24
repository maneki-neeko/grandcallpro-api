import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { cleanupTestingModule, clearDatabase, createTestingModule, TestContext } from 'test/setup';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { getToken } from '../utils';

describe('Extensions Controller (e2e)', () => {
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

  describe('POST /v1/extensions', () => {
    it('Deve criar um novo ramal com sucesso', async () => {
      const token = await getToken(context);

      const payload = {
        number: 302,
        department: 'Departamento',
        sector: 'Setor',
        employee: 'Ana Clara',
      };

      const response = await request(context.httpServer)
        .post('/v1/extensions')
        .set('Authorization', token)
        .send(payload);

      expect(response.body).toMatchObject({
        id: 1,
        number: 302,
        department: 'Departamento',
        sector: 'Setor',
        employee: 'Ana Clara',
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('Não deve ser possível criar um ramal já existente', async () => {
      const token = await getToken(context);

      const payload = {
        number: 302,
        department: 'Departamento',
        sector: 'Setor',
        employee: 'Ana Clara',
      };

      await request(context.httpServer)
        .post('/v1/extensions')
        .set('Authorization', token)
        .send(payload);

      const response = await request(context.httpServer)
        .post('/v1/extensions')
        .set('Authorization', token)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CONFLICT);
    });
  });
});
