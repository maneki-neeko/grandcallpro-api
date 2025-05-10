import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import {
  setupSupertestApp,
  teardownTestApp,
  clearDatabase,
  type TestContext,
  type ExtensionResponse,
} from './supertest-setup';

describe('Extensions API - Update (PUT /v1/extensions)', () => {
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

  it('deve atualizar um ramal existente', async () => {
    // Cria um ramal para teste
    const extensionData = {
      number: 1004,
      departament: 'Marketing',
      sector: 'Digital',
      employee: 'Ana Souza',
    };

    const savedExtension = await testContext.repository.save(extensionData);

    // Dados atualizados
    const updatedData = {
      id: savedExtension.id,
      number: 1005,
      department: 'Marketing',
      sector: 'Tradicional',
      employee: 'Ana Souza Silva',
    };

    const response = await testContext.request.put('/v1/extensions').send(updatedData).expect(200);

    // Verifica se o ramal foi atualizado no banco
    const updatedExtension = await testContext.repository.getById(savedExtension.id);
    expect(updatedExtension).not.toBeNull();
    expect(updatedExtension?.number).toBe(updatedData.number);
    expect(updatedExtension?.sector).toBe(updatedData.sector);
    expect(updatedExtension?.employee).toBe(updatedData.employee);
  });

  it('deve retornar erro ao tentar atualizar um ramal inexistente', async () => {
    const nonExistentData = {
      id: 999,
      number: 1006,
      department: 'Vendas',
      sector: 'Interno',
      employee: 'Pedro Costa',
    };

    await testContext.request.put('/v1/extensions').send(nonExistentData).expect(404);
  });
});
