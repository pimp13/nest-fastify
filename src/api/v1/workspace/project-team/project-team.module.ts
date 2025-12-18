import { Module } from '@nestjs/common';
import { ProjectTeamService } from './project-team.service';
import { ProjectTeamController } from './project-team.controller';
import { ApiResponseService } from '@/utils/api-response/api-response.service';

@Module({
  controllers: [ProjectTeamController],
  providers: [ProjectTeamService, ApiResponseService],
})
export class ProjectTeamModule {}
