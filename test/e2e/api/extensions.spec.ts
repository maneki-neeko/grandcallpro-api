import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { cleanupTestingModule, clearDatabase, createTestingModule, TestContext } from 'test/setup';
import UserLevel from '@users/entities/user-level';
import supertest from 'supertest';
import { log } from 'console';
import { HttpStatus } from '@nestjs/common';

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

  const getToken = async () => {
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

    return `Bearer ${response.body.accessToken}`
  }

  describe('POST /v1/extensions', () => {
    it('Deve criar um novo ramal com sucesso', async () => {
        const token = await getToken()

        const payload = {
            number: 302,
            department: "Departamento",
            sector: "Setor",
            employee: "Ana Clara"
        }

        const response = await supertest(context.httpServer)
        .post('/v1/extensions')
        .set({ authorization: token })
        .send(payload)
        .expect(HttpStatus.CREATED);

        expect(response.body.number).toBe(302)
        expect(response.body.department).toBe("Departamento")
        expect(response.body.sector).toBe("Setor")
        expect(response.body.employee).toBe("Ana Clara")
        expect(response.body.id).toBe(1)
    })

    it('Não deve ser possível criar um ramal já existente', async () => {
        const token = await getToken()

        const payload = {
            number: 302,
            department: "Departamento",
            sector: "Setor",
            employee: "Ana Clara"
        }

        await supertest(context.httpServer)
        .post('/v1/extensions')
        .set({ authorization: token })
        .send(payload)

        await supertest(context.httpServer)
        .post('/v1/extensions')
        .set({ authorization: token })
        .send(payload)
        .expect(HttpStatus.CONFLICT)
    })
  })
})