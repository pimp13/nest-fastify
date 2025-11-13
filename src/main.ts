import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Set versioning
  app.enableVersioning({
    type: VersioningType.URI, // می‌تواند URI, HEADER, MEDIA_TYPE باشد
    defaultVersion: '1',
  });

  // Set swagger api docs
  const config = new DocumentBuilder()
    .setTitle('Nest Fastify API')
    .setDescription('API documentation for Nest-Fastify project')
    .setVersion('1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  const PORT = configService.get<number>('PORT') || 9090;

  await app.listen(PORT);
  console.log(`Application API is running on: http://127.0.0.1:${PORT}`);
}
bootstrap();
