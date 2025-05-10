import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { closeTestDatabase } from '../../setup';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { setupTestServer, type TestContext, BASE_URL } from './test-setup';

describe('Extensions API - Update (PUT /v1/extensions)', () => {
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

  it('deve atualizar um ramal existente', async () => {
    // Cria um ramal para teste
    const extensionData = {
      number: 1004,
      departament: 'Marketing',
      sector: 'Digital',
      employee: 'Ana Souza'
    };

    const savedExtension = await testContext.repository.save(extensionData);

    // Dados atualizados
    const updatedData = {
      id: savedExtension.id,
      number: 1005,
      department: 'Marketing',
      sector: 'Tradicional',
      employee: 'Ana Souza Silva'
    };

    const response = await fetch(BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });

    expect(response.status).toBe(200);
    
    // Verifica se o ramal foi atualizado no banco
    const updatedExtension = await testContext.repository.getById(savedExtension.id);
    expect(updatedExtension).not.toBeNull();
    expect(updatedExtension?.number).toBe(updatedData.number);
    expect(updatedExtension?.sector).toBe(updatedData.sector);
    expect(updatedExtension?.employee).toBe(updatedData.employee);
  });
});
