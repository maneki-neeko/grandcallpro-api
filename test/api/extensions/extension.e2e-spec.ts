import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import supertest from 'supertest';
import { Extension } from '../../../src/modules/api/entities/extension.entity';
import { createTestingModule, cleanupTestingModule, clearDatabase, type TestContext } from '../../setup';
import { Repository } from 'typeorm';

describe('Extension Controller (e2e)', () => {
  let context: TestContext;
  let extensionRepository: Repository<Extension>;

  beforeAll(async () => {
    context = await createTestingModule();
    extensionRepository = context.dataSource.getRepository(Extension);
  });

  afterAll(async () => {
    await cleanupTestingModule(context);
  });

  beforeEach(async () => {
    await clearDatabase(context.dataSource);
  });

  describe('POST /v1/extensions', () => {
    it('deve criar um novo ramal com sucesso', async () => {
      const extensionData = {
        number: 1001,
        department: 'TI',
        sector: 'Desenvolvimento',
        employee: 'João Silva',
      };

      const response = await supertest(context.httpServer)
        .post('/v1/extensions')
        .send(extensionData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.number).toBe(extensionData.number);
      expect(response.body.department).toBe(extensionData.department);
      expect(response.body.sector).toBe(extensionData.sector);
      expect(response.body.employee).toBe(extensionData.employee);

      // Verifica se foi salvo no banco
      const savedExtension = await extensionRepository.findOne({
        where: { id: response.body.id }
      });
      expect(savedExtension).toBeDefined();
    });

    it('deve retornar erro ao tentar criar um ramal com dados inválidos', async () => {
      const invalidData = {
        number: 'abc', // deveria ser número
        department: '',
        sector: '',
        employee: '',
      };

      await supertest(context.httpServer)
        .post('/v1/extensions')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /v1/extensions', () => {
    it('deve listar todos os ramais', async () => {
      // Cria alguns ramais para teste
      const extensions = [
        { number: 1001, department: 'TI', sector: 'Desenvolvimento', employee: 'João Silva' },
        { number: 1002, department: 'RH', sector: 'Recrutamento', employee: 'Maria Santos' },
      ];

      await extensionRepository.save(extensions);

      const response = await supertest(context.httpServer)
        .get('/v1/extensions')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('deve retornar uma lista vazia quando não há ramais', async () => {
      const response = await supertest(context.httpServer)
        .get('/v1/extensions')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /v1/extensions/:id', () => {
    it('deve retornar um ramal específico por ID', async () => {
      const extension = await extensionRepository.save({
        number: 1003,
        department: 'Financeiro',
        sector: 'Contabilidade',
        employee: 'Carlos Oliveira',
      });

      const response = await supertest(context.httpServer)
        .get(`/v1/extensions/${extension.id}`)
        .expect(200);

      expect(response.body.id).toBe(extension.id);
      expect(response.body.number).toBe(extension.number);
      expect(response.body.department).toBe(extension.department);
      expect(response.body.sector).toBe(extension.sector);
      expect(response.body.employee).toBe(extension.employee);
    });

    it('deve retornar erro ao buscar um ramal inexistente', async () => {
      await supertest(context.httpServer)
        .get('/v1/extensions/999')
        .expect(404);
    });
  });

  describe('PUT /v1/extensions', () => {
    it('deve atualizar um ramal existente', async () => {
      const extension = await extensionRepository.save({
        number: 1004,
        department: 'Marketing',
        sector: 'Digital',
        employee: 'Ana Souza',
      });

      const updatedData = {
        id: extension.id,
        number: 1005,
        department: 'Marketing',
        sector: 'Tradicional',
        employee: 'Ana Souza Silva',
      };

      const response = await supertest(context.httpServer)
        .put('/v1/extensions')
        .send(updatedData)
        .expect(200);

      expect(response.body.id).toBe(extension.id);
      expect(response.body.number).toBe(updatedData.number);
      expect(response.body.department).toBe(updatedData.department);
      expect(response.body.sector).toBe(updatedData.sector);
      expect(response.body.employee).toBe(updatedData.employee);

      // Verifica se foi atualizado no banco
      const updatedExtension = await extensionRepository.findOne({
        where: { id: extension.id }
      });
      expect(updatedExtension).toBeDefined();
      expect(updatedExtension?.number).toBe(updatedData.number);
    });

    it('deve retornar erro ao tentar atualizar um ramal inexistente', async () => {
      const updatedData = {
        id: 999,
        number: 1005,
        department: 'Marketing',
        sector: 'Tradicional',
        employee: 'Ana Souza Silva',
      };

      await supertest(context.httpServer)
        .put('/v1/extensions')
        .send(updatedData)
        .expect(404);
    });
  });

  describe('DELETE /v1/extensions/:id', () => {
    it('deve excluir um ramal existente', async () => {
      const extension = await extensionRepository.save({
        number: 1006,
        department: 'Vendas',
        sector: 'Interno',
        employee: 'Pedro Costa',
      });

      await supertest(context.httpServer)
        .delete(`/v1/extensions/${extension.id}`)
        .expect(204);

      // Verifica se foi removido do banco
      const deletedExtension = await extensionRepository.findOne({
        where: { id: extension.id }
      });
      expect(deletedExtension).toBeNull();
    });

    it('deve retornar erro ao tentar excluir um ramal inexistente', async () => {
      await supertest(context.httpServer)
        .delete('/v1/extensions/999')
        .expect(404);
    });
  });
});
