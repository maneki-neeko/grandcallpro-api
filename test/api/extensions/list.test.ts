import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import {
  setupSupertestApp,
  teardownTestApp,
  clearDatabase,
  type TestContext,
  type ExtensionListResponse,
} from './supertest-setup';

describe('Extensions API - List (GET /v1/extensions)', () => {
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

  it('deve listar todos os ramais', async () => {
    // Cria alguns ramais para teste
    const extensions = [
      { number: 1001, department: 'TI', sector: 'Desenvolvimento', employee: 'João Silva' },
      { number: 1002, department: 'RH', sector: 'Recrutamento', employee: 'Maria Santos' },
    ];

    for (const ext of extensions) {
      await testContext.repository.save({
        number: ext.number,
        departament: ext.department,
        sector: ext.sector,
        employee: ext.employee,
      });
    }

    const response = await testContext.request.get('/v1/extensions').expect(200);

    const result = response.body as ExtensionListResponse;
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    // Verifica se os ramais criados estão na lista
    const numbers = result.map(ext => ext.number);
    expect(numbers).toContain(1001);
    expect(numbers).toContain(1002);
  });

  it('deve retornar uma lista vazia quando não há ramais', async () => {
    const response = await testContext.request.get('/v1/extensions').expect(200);

    const result = response.body as ExtensionListResponse;
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
