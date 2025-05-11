import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extension } from '../../../src/modules/api/entities/extension.entity';
import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  type TestContext,
} from './test-setup';

describe('Extensions API - Create (POST /v1/extensions)', () => {
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

  it('deve criar um novo ramal com sucesso', async () => {
    const extensionData = {
      number: 1001,
      department: 'TI',
      sector: 'Desenvolvimento',
      employee: 'João Silva',
    };

    const response = await testContext.request
      .post('/v1/extensions')
      .send(extensionData)
      .expect(201);

    const result = response.body as Extension;
    expect(result.id).toBeDefined();
    expect(result.number).toBe(extensionData.number);
    expect(result.department).toBe(extensionData.department);
    expect(result.sector).toBe(extensionData.sector);
    expect(result.employee).toBe(extensionData.employee);
  });

  it('deve retornar erro ao tentar criar um ramal com dados inválidos', async () => {
    const invalidData = {
      // Número ausente
      departament: 'TI',
      sector: 'Desenvolvimento',
      employee: 'João Silva',
    };

    await testContext.request.post('/v1/extensions').send(invalidData).expect(500);
  });
});
