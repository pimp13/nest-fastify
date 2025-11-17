import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { ApiResponseService } from './utils/api-response/api-response.service';
import { WorkspaceModule } from './api/v1/workspace/workspace.module';
import { ApiResponseModule } from './utils/api-response/api-response.module';
import { AdminMiddleware } from './common/middleware/admin.middleware';
import { DashboardModule } from './api/v1/admin/dashboard/dashboard.module';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from './api/v1/admin/dashboard/dashboard.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: cfg.get<number | undefined>('JWT_EXPIRES_IN') ?? 3600,
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    WorkspaceModule,
    ApiResponseModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApiResponseService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes({
      path: 'admin/*',
      method: RequestMethod.ALL,
      version: '1',
    });
  }
}
