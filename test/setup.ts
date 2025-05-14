import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { Extension } from '@api/entities/extension.entity';
import { CallRecord } from '@core/entities/call-record.entity';
import { User } from '@users/entities/user.entity';
import { ExtensionController } from '@api/controllers/extension.controller';
import { ExtensionService } from '@api/services/extension.service';
import { UsersController } from '@users/controllers/users.controller';
import { UsersService } from '@users/services/users.service';
import { AuthController } from '@users/controllers/auth.controller';
import { AuthService } from '@users/services/auth.service';
import { JwtStrategy } from '@users/strategies/jwt.strategy';

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
        entities: [Extension, CallRecord, User],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([Extension, User]),
      JwtModule.register({
        secret: 'test-secret-key',
        signOptions: { expiresIn: '1h' },
      }),
    ],
    controllers: [ExtensionController, UsersController, AuthController],
    providers: [ExtensionService, UsersService, AuthService, JwtStrategy],
  }).compile();

  const app = moduleRef.createNestApplication();

  // Configurar pipes globais como na aplicação real
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

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
