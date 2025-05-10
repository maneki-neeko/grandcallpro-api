import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { closeTestDatabase } from '../../setup';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { setupTestServer, type TestContext, BASE_URL, type ExtensionResponse } from './test-setup';

describe('Extensions API - Create (POST /v1/extensions)', () => {
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

  it('deve criar um novo ramal com sucesso', async () => {
    const extensionData = {
      number: 1001,
      departament: 'TI',
      sector: 'Desenvolvimento',
      employee: 'João Silva'
    };

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(extensionData)
    });

    expect(response.status).toBe(201);
    
    const result = await response.json() as ExtensionResponse;
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

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidData)
    });

    // Como não há validação implementada ainda, o teste espera status 500
    // Quando a validação for implementada, este teste deve ser atualizado
    expect(response.status).toBe(500);
  });
});
