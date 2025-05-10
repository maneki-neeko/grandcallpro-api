import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { closeTestDatabase } from '../../setup';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { setupTestServer, type TestContext, BASE_URL } from './test-setup';

describe('Extensions API - Delete (DELETE /v1/extensions/:id)', () => {
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

  it('deve excluir um ramal existente', async () => {
    // Cria um ramal para teste
    const extensionData = {
      number: 1007,
      departament: 'Suporte',
      sector: 'Técnico',
      employee: 'Roberto Alves'
    };

    const savedExtension = await testContext.repository.save(extensionData);

    const response = await fetch(`${BASE_URL}/${savedExtension.id}`, {
      method: 'DELETE'
    });

    expect(response.status).toBe(204);
    
    // Verifica se o ramal foi removido do banco
    const deletedExtension = await testContext.repository.getById(savedExtension.id);
    expect(deletedExtension).toBeNull();
  });

  it('deve retornar erro ao tentar excluir um ramal inexistente', async () => {
    const response = await fetch(`${BASE_URL}/999`, {
      method: 'DELETE'
    });

    expect(response.status).toBe(404);
  });
});
