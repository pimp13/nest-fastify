import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { ApiResponseService } from './utils/api-response/api-response.service';
import { WorkspaceModule } from './api/v1/workspace/workspace.module';
import { ApiResponseModule } from './utils/api-response/api-response.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    WorkspaceModule,
    ApiResponseModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApiResponseService],
})
export class AppModule {}
