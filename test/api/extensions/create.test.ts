import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { setupSupertestApp, teardownTestApp, clearDatabase, type TestContext, type ExtensionResponse } from './supertest-setup';

describe('Extensions API - Create (POST /v1/extensions)', () => {
  let testContext: TestContext;

  // Configuração antes de todos os testes
  beforeAll(async () => {
    testContext = await setupSupertestApp();
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    await teardownTestApp();
  });

  // Limpa o banco de dados antes de cada teste
  beforeEach(async () => {
    await clearDatabase(testContext.dataSource);
  });

  it('deve criar um novo ramal com sucesso', async () => {
    const extensionData = {
      number: 1001,
      departament: 'TI',
      sector: 'Desenvolvimento',
      employee: 'João Silva'
    };

    const response = await testContext.request
      .post('/v1/extensions')
      .send(extensionData)
      .expect(201);
    
    const result = response.body as ExtensionResponse;
    expect(result.id).toBeDefined();
    expect(result.number).toBe(extensionData.number);
    expect(result.department).toBe(extensionData.departament);
    expect(result.sector).toBe(extensionData.sector);
    expect(result.employee).toBe(extensionData.employee);
  });

  it('deve retornar erro ao tentar criar um ramal com dados inválidos', async () => {
    const invalidData = {
      // Número ausente
      departament: 'TI',
      sector: 'Desenvolvimento',
      employee: 'João Silva'
    };

    await testContext.request
      .post('/v1/extensions')
      .send(invalidData)
      .expect(500);
  });
});
