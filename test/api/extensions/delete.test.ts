import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import {
  setupSupertestApp,
  teardownTestApp,
  clearDatabase,
  type TestContext,
} from './supertest-setup';

describe('Extensions API - Delete (DELETE /v1/extensions/:id)', () => {
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

  it('deve excluir um ramal existente', async () => {
    // Cria um ramal para teste
    const extensionData = {
      number: 1007,
      departament: 'Suporte',
      sector: 'Técnico',
      employee: 'Roberto Alves',
    };

    const savedExtension = await testContext.repository.save(extensionData);

    await testContext.request.delete(`/v1/extensions/${savedExtension.id}`).expect(204);

    // Verifica se o ramal foi removido do banco
    const deletedExtension = await testContext.repository.getById(savedExtension.id);
    expect(deletedExtension).toBeNull();
  });

  it('deve retornar erro ao tentar excluir um ramal inexistente', async () => {
    await testContext.request.delete('/v1/extensions/999').expect(404);
  });
});
