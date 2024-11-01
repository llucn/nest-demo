import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { openApiDocument } from './open.api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerModule.setup('api-docs', app, openApiDocument);
  await app.listen(3000);
}
bootstrap();
