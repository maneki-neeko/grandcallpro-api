import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import supertest from 'supertest';
import { Extension } from '../src/modules/api/entities/extension.entity';
import { CallRecord } from '../src/modules/core/entities/call-record.entity';
import { ExtensionController } from '../src/modules/api/controllers/extension.controller';
import { ExtensionService } from '../src/modules/api/services/extension.service';

export interface TestContext {
  app: INestApplication;
  dataSource: DataSource;
  module: TestingModule;
  httpServer: any;
}

export async function createTestingModule(): Promise<TestContext> {
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
  const httpServer = app.getHttpServer();

  return {
    app,
    dataSource: moduleRef.get(DataSource),
    module: moduleRef,
    httpServer,
  };
}

export async function cleanupTestingModule(context: TestContext): Promise<void> {
  await context.app.close();
}

export async function clearDatabase(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  }
}
