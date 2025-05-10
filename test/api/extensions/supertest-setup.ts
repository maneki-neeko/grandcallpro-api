import { DataSource } from 'typeorm';
import type { Express } from 'express';
import supertest from 'supertest';
import express from 'express';
import { initializeTestDatabase, closeTestDatabase } from '../../setup';
import { Extensions } from '../../../src/modules/api/entities/Extensions';
import { ExtensionsRepository } from '../../../src/modules/api/repositories/ExtensionsRepository';
import { ProcessExtensionsCreationUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsCreationUseCase';
import { ProcessExtensionsDeleteUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsDeleteUseCase';
import { ProcessExtensionsGetAllUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsGetAllUseCase';
import { ProcessExtensionsUpdateUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsUpdateUseCase';
import { ProcessExtensionsGetByIdUseCase } from '../../../src/modules/api/usecases/ProcessExtensionsGetByIdUseCase';
import { ExtensionsController } from '../../../src/modules/api/controllers/ExtensionsController';

export interface TestContext {
  dataSource: DataSource;
  app: Express;
  request: ReturnType<typeof supertest>;
  repository: ExtensionsRepository;
}

export interface ExtensionResponse extends Extensions {}
export type ExtensionListResponse = ExtensionResponse[];

export async function setupSupertestApp(): Promise<TestContext> {
  // Inicializa o banco de dados de teste em memória
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

  // Cria o cliente supertest
  const request = supertest(app);

  return { dataSource, app, request, repository };
}

export async function teardownTestApp(): Promise<void> {
  await closeTestDatabase();
}

// Função auxiliar para limpar o banco de dados entre os testes
export async function clearDatabase(dataSource: DataSource): Promise<void> {
  await dataSource.getRepository(Extensions).clear();
}
