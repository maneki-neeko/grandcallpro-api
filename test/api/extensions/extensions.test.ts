import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { TestDataSource, initializeTestDatabase, closeTestDatabase } from '../../setup';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { ExtensionsRepository } from '../../../src/modules/api/repositories/ExtensionsRepository';
import { ProcessExtensionsCreationUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsCreationUseCase';
import { ProcessExtensionsDeleteUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsDeleteUseCase';
import { ProcessExtensionsGetAllUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsGetAllUseCase';
import { ProcessExtensionsUpdateUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsUpdateUseCase';
import { ProcessExtensionsGetByIdUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsGetByIdUseCase';
import { ExtensionsController } from '../../../src/modules/api/controllers/ExtensionsController';
import express from 'express';
import { Server } from 'http';

describe('Extensions API Integration Tests', () => {
  let dataSource: typeof TestDataSource;
  let app: express.Application;
  let server: Server;
  let repository: ExtensionsRepository;
  const PORT = 8082; // Porta diferente da aplicação principal
  const BASE_URL = `http://localhost:${PORT}/v1/extensions`;

  // Configuração antes de todos os testes
  beforeAll(async () => {
    // Inicializa o banco de dados de teste
    dataSource = await initializeTestDatabase();
    repository = new ExtensionsRepository(dataSource);

    // Configura a aplicação Express para testes
    app = express();
    app.use(express.json());

    // Inicializa os casos de uso
    const createUseCase = new ProcessExtensionsCreationUseCase();
    const deleteUseCase = new ProcessExtensionsDeleteUseCase();
    const getAllUseCase = new ProcessExtensionsGetAllUseCase();
    const updateUseCase = new ProcessExtensionsUpdateUseCase();
    const getByIdUseCase = new ProcessExtensionsGetByIdUseCase();

    // Sobrescreve o construtor para usar o datasource de teste
    Object.defineProperty(createUseCase, 'extensionsRepository', { value: repository });
    Object.defineProperty(deleteUseCase, 'extensionsRepository', { value: repository });
    Object.defineProperty(getAllUseCase, 'extensionsRepository', { value: repository });
    Object.defineProperty(updateUseCase, 'extensionsRepository', { value: repository });
    Object.defineProperty(getByIdUseCase, 'extensionsRepository', { value: repository });

    // Inicializa o controller
    const controller = new ExtensionsController(
      createUseCase,
      deleteUseCase,
      getAllUseCase,
      updateUseCase,
      getByIdUseCase
    );

    // Configura as rotas
    const router = express.Router();
    router.post('/', (req, res) => controller.create(req, res));
    router.delete('/:id', (req, res) => controller.delete(req, res));
    router.get('/', (req, res) => controller.getAll(req, res));
    router.put('/', (req, res) => controller.update(req, res));
    router.get('/:id', (req, res) => controller.getById(req, res));

    app.use('/v1/extensions', router);

    // Inicia o servidor
    server = app.listen(PORT, () => {
      console.log(`Servidor de teste rodando na porta ${PORT}`);
    });
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    // Fecha o servidor
    server.close();
    // Fecha a conexão com o banco de dados
    await closeTestDatabase();
  });

  // Limpa o banco de dados antes de cada teste
  beforeEach(async () => {
    await dataSource.getRepository(Extensions).clear();
  });

  // Testes para a criação de ramais
  describe('POST /v1/extensions', () => {
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
      
      const result = await response.json();
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

  // Testes para a listagem de ramais
  describe('GET /v1/extensions', () => {
    it('deve listar todos os ramais', async () => {
      // Cria alguns ramais para teste
      const extensions = [
        { number: 1001, department: 'TI', sector: 'Desenvolvimento', employee: 'João Silva' },
        { number: 1002, department: 'RH', sector: 'Recrutamento', employee: 'Maria Santos' }
      ];

      for (const ext of extensions) {
        await repository.save({
          number: ext.number,
          departament: ext.department,
          sector: ext.sector,
          employee: ext.employee
        });
      }

      const response = await fetch(BASE_URL);
      expect(response.status).toBe(200);
      
      const result = await response.json();
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
      
      const result = await response.json();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  // Testes para buscar ramal por ID
  describe('GET /v1/extensions/:id', () => {
    it('deve retornar um ramal específico por ID', async () => {
      // Cria um ramal para teste
      const extensionData = {
        number: 1003,
        departament: 'Financeiro',
        sector: 'Contabilidade',
        employee: 'Carlos Oliveira'
      };

      const savedExtension = await repository.save(extensionData);

      const response = await fetch(`${BASE_URL}/${savedExtension.id}`);
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.id).toBe(savedExtension.id);
      expect(result.number).toBe(extensionData.number);
      expect(result.department).toBe(extensionData.departament);
      expect(result.sector).toBe(extensionData.sector);
      expect(result.employee).toBe(extensionData.employee);
    });

    it('deve retornar erro ao buscar um ramal inexistente', async () => {
      const response = await fetch(`${BASE_URL}/999`);
      
      // Como o controller atual não trata especificamente o caso de não encontrar o ramal,
      // este teste pode precisar ser ajustado quando essa funcionalidade for implementada
      expect(response.status).toBe(500);
    });
  });

  // Testes para atualização de ramais
  describe('PUT /v1/extensions', () => {
    it('deve atualizar um ramal existente', async () => {
      // Cria um ramal para teste
      const extensionData = {
        number: 1004,
        departament: 'Marketing',
        sector: 'Digital',
        employee: 'Ana Souza'
      };

      const savedExtension = await repository.save(extensionData);

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
      const updatedExtension = await repository.getById(savedExtension.id);
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
        employee: 'Pedro Costa'
      };

      const response = await fetch(BASE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nonExistentData)
      });

      // Como o controller atual não trata especificamente o caso de não encontrar o ramal,
      // este teste pode precisar ser ajustado quando essa funcionalidade for implementada
      expect(response.status).toBe(500);
    });
  });

  // Testes para exclusão de ramais
  describe('DELETE /v1/extensions/:id', () => {
    it('deve excluir um ramal existente', async () => {
      // Cria um ramal para teste
      const extensionData = {
        number: 1007,
        departament: 'Suporte',
        sector: 'Técnico',
        employee: 'Roberto Alves'
      };

      const savedExtension = await repository.save(extensionData);

      const response = await fetch(`${BASE_URL}/${savedExtension.id}`, {
        method: 'DELETE'
      });

      expect(response.status).toBe(204);
      
      // Verifica se o ramal foi removido do banco
      const deletedExtension = await repository.getById(savedExtension.id);
      expect(deletedExtension).toBeNull();
    });

    it('deve retornar erro ao tentar excluir um ramal inexistente', async () => {
      const response = await fetch(`${BASE_URL}/999`, {
        method: 'DELETE'
      });

      // Como o controller atual não trata especificamente o caso de não encontrar o ramal,
      // este teste pode precisar ser ajustado quando essa funcionalidade for implementada
      expect(response.status).toBe(500);
    });
  });
});
