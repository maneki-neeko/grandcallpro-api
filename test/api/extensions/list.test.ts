import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extension } from '../../../src/modules/api/entities/extension.entity';
import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  type TestContext,
} from './test-setup';

describe('Extensions API - List (GET /v1/extensions)', () => {
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

  it('deve listar todos os ramais', async () => {
    // Cria alguns ramais para teste
    const extensions = [
      { number: 1001, department: 'TI', sector: 'Desenvolvimento', employee: 'João Silva' },
      { number: 1002, department: 'RH', sector: 'Recrutamento', employee: 'Maria Santos' },
    ];

    const entityManager = testContext.dataSource.manager;

    for (const ext of extensions) {
      const extension = new Extension();
      extension.number = ext.number;
      extension.department = ext.department;
      extension.sector = ext.sector;
      extension.employee = ext.employee;
      await entityManager.save(extension);
    }

    const response = await testContext.request.get('/v1/extensions').expect(200);

    const result = response.body as Extension[];
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);

    // Verifica se os ramais criados estão na lista
    const numbers = result.map(ext => ext.number);
    expect(numbers).toContain(1001);
    expect(numbers).toContain(1002);
  });

  it('deve retornar uma lista vazia quando não há ramais', async () => {
    const response = await testContext.request.get('/v1/extensions').expect(200);

    const result = response.body as Extension[];
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
