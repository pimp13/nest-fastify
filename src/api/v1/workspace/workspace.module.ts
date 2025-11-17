import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { ApiResponseService } from 'src/utils/api-response/api-response.service';
import { ProjectModule } from './project/project.module';
import { SectionModule } from './section/section.module';
import { ProjectTeamModule } from './project-team/project-team.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, ApiResponseService],
  imports: [ProjectModule, SectionModule, ProjectTeamModule],
})
export class WorkspaceModule {}
