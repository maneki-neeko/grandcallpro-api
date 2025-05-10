import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { setupSupertestApp, teardownTestApp, clearDatabase, type TestContext, type ExtensionResponse } from './supertest-setup';

describe('Extensions API - Get By ID (GET /v1/extensions/:id)', () => {
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

  it('deve retornar um ramal específico por ID', async () => {
    // Cria um ramal para teste
    const extensionData = {
      number: 1003,
      departament: 'Financeiro',
      sector: 'Contabilidade',
      employee: 'Carlos Oliveira'
    };

    const savedExtension = await testContext.repository.save(extensionData);

    const response = await testContext.request
      .get(`/v1/extensions/${savedExtension.id}`)
      .expect(200);
    
    const result = response.body as ExtensionResponse;
    expect(result.id).toBe(savedExtension.id);
    expect(result.number).toBe(extensionData.number);
    expect(result.department).toBe(extensionData.departament);
    expect(result.sector).toBe(extensionData.sector);
    expect(result.employee).toBe(extensionData.employee);
  });

  it('deve retornar erro ao buscar um ramal inexistente', async () => {
    await testContext.request
      .get('/v1/extensions/999')
      .expect(404);
  });
});
