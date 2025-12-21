import cookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const configService = app.get(ConfigService);

  // Register file max size
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Serve static files from public
  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public', 'uploads'),
    prefix: '/uploads/',
  });

  // Set validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set versioning
  app.enableVersioning({
    type: VersioningType.URI, // می‌تواند URI, HEADER, MEDIA_TYPE باشد
    defaultVersion: '1',
  });

  // Set swagger api docs
  if (
    configService.get<'development' | 'production'>('NODE_ENV') ===
    'development'
  ) {
    const config = new DocumentBuilder()
      .setTitle('Nest Fastify API')
      .setDescription('API documentation for Nest-Fastify project')
      .setVersion('1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Set CORS
  app.enableCors({
    origin: [
      configService.get<string>('FRONT_END_URL') || 'http://localhost:3000',
    ],
    credentials: true,
  });

  // Set auth cookie token
  await app.register(cookie as any, {
    secret: configService.get<string>('AUTH_COOKIE_NAME'),
  });

  const PORT = configService.get<number>('PORT') || 9090;

  await app.listen(PORT);
  console.log(`Application API is running on: http://127.0.0.1:${PORT}`);
}
bootstrap();
