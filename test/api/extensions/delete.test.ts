import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extension } from '../../../src/modules/api/entities/extension.entity';
import {
  setupTestApp,
  teardownTestApp,
  clearDatabase,
  type TestContext,
} from './test-setup';

describe('Extensions API - Delete (DELETE /v1/extensions/:id)', () => {
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

  it('deve excluir um ramal existente', async () => {
    // Cria um ramal para teste
    const extension = new Extension();
    extension.number = 1007;
    extension.department = 'Suporte';
    extension.sector = 'Técnico';
    extension.employee = 'Roberto Alves';

    // Salva o ramal usando o EntityManager
    const entityManager = testContext.dataSource.manager;
    const savedExtension = await entityManager.save(Extension, extension);

    // Tenta excluir o ramal
    const response = await testContext.request
      .delete(`/v1/extensions/${savedExtension.id}`)
      .expect(204);

    // Verifica se o ramal foi realmente excluído
    const deletedExtension = await entityManager.findOne(Extension, {
      where: { id: savedExtension.id }
    });
    expect(deletedExtension).toBeNull();
  });

  it('deve retornar erro ao tentar excluir um ramal inexistente', async () => {
    await testContext.request.delete('/v1/extensions/999').expect(404);
  });
});
