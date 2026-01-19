import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { openApiDocument } from './open.api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerModule.setup('api-docs', app, openApiDocument);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  });
  await app.listen(3000);
}
bootstrap();
