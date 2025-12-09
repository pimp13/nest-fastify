import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ApiResponseService } from '@/utils/api-response/api-response.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ApiResponseService],
})
export class ProjectModule {}
