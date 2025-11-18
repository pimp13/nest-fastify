import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminMiddleware } from 'src/common/middleware/admin.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DashboardModule],
  providers: [JwtService],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('*');
  }
}
