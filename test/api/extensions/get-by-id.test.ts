import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extension } from '../../../src/modules/api/entities/extension.entity';
import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  type TestContext,
} from './test-setup';

describe('Extensions API - Get By ID (GET /v1/extensions/:id)', () => {
  let testContext: TestContext;

  // Configuração antes de todos os testes
  beforeAll(async () => {
    testContext = await setupTestApp();
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    await teardownTestApp(testContext);
  });

  // Limpa o banco de dados antes de cada teste
  beforeEach(async () => {
    await clearDatabase(testContext.dataSource);
  });

  it('deve retornar um ramal específico por ID', async () => {
    // Cria um ramal para teste
    const extension = new Extension();
    extension.number = 1003;
    extension.department = 'Financeiro';
    extension.sector = 'Contabilidade';
    extension.employee = 'Carlos Oliveira';

    const entityManager = testContext.dataSource.manager;
    const savedExtension = await entityManager.save(extension);

    const response = await testContext.request
      .get(`/v1/extensions/${savedExtension.id}`)
      .expect(200);

    const result = response.body as Extension;
    expect(result.id).toBe(savedExtension.id);
    expect(result.number).toBe(extension.number);
    expect(result.department).toBe(extension.department);
    expect(result.sector).toBe(extension.sector);
    expect(result.employee).toBe(extension.employee);
  });

  it('deve retornar erro ao buscar um ramal inexistente', async () => {
    await testContext.request.get('/v1/extensions/999').expect(404);
  });
});
