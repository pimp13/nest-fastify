import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { ApiResponseService } from 'src/utils/api-response/api-response.service';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, ApiResponseService],
})
export class WorkspaceModule {}
