import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import supertest from 'supertest';
import { initializeTestDatabase, closeTestDatabase } from '../../setup';
import { Extension } from '../../../src/modules/api/entities/extension.entity';
import { CallRecord } from '../../../src/modules/core/entities/call-record.entity';
import { ExtensionController } from '../../../src/modules/api/controllers/extension.controller';
import { ExtensionService } from '../../../src/modules/api/services/extension.service';

export interface TestContext {
  app: INestApplication;
  dataSource: DataSource;
  module: TestingModule;
  request: any; // Using any temporarily to fix typing issues with supertest
}

export async function setupTestApp(): Promise<TestContext> {
  const dataSource = await initializeTestDatabase();

  const moduleRef = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [Extension, CallRecord],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([Extension]),
    ],
    controllers: [ExtensionController],
    providers: [ExtensionService],
  }).compile();

  const app = moduleRef.createNestApplication();
  
  // Configurar pipes globais como na aplicação real
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  await app.init();

  return {
    app,
    dataSource,
    module: moduleRef,
    request: supertest(app.getHttpServer()),
  };
}

export async function teardownTestApp(context: TestContext): Promise<void> {
  await context.app.close();
  await closeTestDatabase();
}

export async function clearDatabase(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  }
}
