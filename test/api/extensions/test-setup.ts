import { TestDataSource, initializeTestDatabase } from '../../setup';
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

export const PORT = 8082; // Porta diferente da aplicação principal
export const BASE_URL = `http://localhost:${PORT}/v1/extensions`;

export interface TestContext {
  dataSource: typeof TestDataSource;
  app: express.Application;
  server: Server;
  repository: ExtensionsRepository;
}

export async function setupTestServer(): Promise<TestContext> {
  // Inicializa o banco de dados de teste
  const dataSource = await initializeTestDatabase();
  const repository = new ExtensionsRepository(dataSource);

  // Configura a aplicação Express para testes
  const app = express();
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
  const server = app.listen(PORT, () => {
    console.log(`Servidor de teste rodando na porta ${PORT}`);
  });

  return { dataSource, app, server, repository };
}

// Interface para tipagem das respostas
export interface ExtensionResponse extends Extensions {}
export type ExtensionListResponse = ExtensionResponse[];
