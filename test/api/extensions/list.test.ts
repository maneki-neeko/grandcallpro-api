import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { closeTestDatabase } from '../../setup';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { setupTestServer, type TestContext, BASE_URL, type ExtensionListResponse } from './test-setup';

describe('Extensions API - List (GET /v1/extensions)', () => {
  let testContext: TestContext;

  // Configuração antes de todos os testes
  beforeAll(async () => {
    testContext = await setupTestServer();
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    // Fecha o servidor
    testContext.server.close();
    // Fecha a conexão com o banco de dados
    await closeTestDatabase();
  });

  // Limpa o banco de dados antes de cada teste
  beforeEach(async () => {
    await testContext.dataSource.getRepository(Extensions).clear();
  });

  it('deve listar todos os ramais', async () => {
    // Cria alguns ramais para teste
    const extensions = [
      { number: 1001, department: 'TI', sector: 'Desenvolvimento', employee: 'João Silva' },
      { number: 1002, department: 'RH', sector: 'Recrutamento', employee: 'Maria Santos' }
    ];

    for (const ext of extensions) {
      await testContext.repository.save({
        number: ext.number,
        departament: ext.department,
        sector: ext.sector,
        employee: ext.employee
      });
    }

    const response = await fetch(BASE_URL);
    expect(response.status).toBe(200);
    
    const result = await response.json() as ExtensionListResponse;
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    
    // Verifica se os ramais criados estão na lista
    const numbers = result.map((ext) => ext.number);
    expect(numbers).toContain(1001);
    expect(numbers).toContain(1002);
  });

  it('deve retornar uma lista vazia quando não há ramais', async () => {
    const response = await fetch(BASE_URL);
    expect(response.status).toBe(200);
    
    const result = await response.json() as ExtensionListResponse;
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
