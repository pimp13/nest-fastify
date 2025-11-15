import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { ProjectModule } from './api/v1/project/project.module';
import { ApiResponseService } from './utils/api-response/api-response.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApiResponseService],
})
export class AppModule {}
