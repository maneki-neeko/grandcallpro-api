import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Configuração global de validação de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Habilitar CORS
  app.enableCors();

  const port = process.env.PORT || 8081;
  await app.listen(port);

  logger.log(`Application running on port ${port}`);
}

bootstrap().catch(err => {
  console.error('Error starting application:', err);
});
