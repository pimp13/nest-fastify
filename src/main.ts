import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  const PORT = configService.get<number>('PORT') || 9090;

  await app.listen(PORT);
  console.log(`Application API is running on: http://127.0.0.1:${PORT}`);
}
bootstrap();
