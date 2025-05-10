import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { closeTestDatabase } from '../../setup';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { setupTestServer, type TestContext, BASE_URL, type ExtensionResponse } from './test-setup';

describe('Extensions API - Get By ID (GET /v1/extensions/:id)', () => {
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

  it('deve retornar um ramal específico por ID', async () => {
    // Cria um ramal para teste
    const extensionData = {
      number: 1003,
      departament: 'Financeiro',
      sector: 'Contabilidade',
      employee: 'Carlos Oliveira'
    };

    const savedExtension = await testContext.repository.save(extensionData);

    const response = await fetch(`${BASE_URL}/${savedExtension.id}`);
    expect(response.status).toBe(200);
    
    const result = await response.json() as ExtensionResponse;
    expect(result.id).toBe(savedExtension.id);
    expect(result.number).toBe(extensionData.number);
    expect(result.department).toBe(extensionData.departament);
    expect(result.sector).toBe(extensionData.sector);
    expect(result.employee).toBe(extensionData.employee);
  });

  it('deve retornar erro ao buscar um ramal inexistente', async () => {
    const response = await fetch(`${BASE_URL}/999`);
    
    expect(response.status).toBe(404);
  });
});
