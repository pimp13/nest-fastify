import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { FileUploader } from '@/common/file-uploader/file-uploader.decorator';
import { FileUploaderInterceptor } from '@/common/file-uploader/file-uploader.interceptor';

@UseGuards(JwtGuard)
@ApiTags('[WorkSpace]')
@Controller({ path: 'workspace', version: '1' })
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @FileUploader({
    fieldName: 'image',
    allowedMimes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg'],
    maxSize: 1, // MB,
    required: true,
  })
  @UseInterceptors(FileUploaderInterceptor)
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Req() req,
    @UploadedFile() file,
  ) {
    return this.workspaceService.create(
      createWorkspaceDto,
      req.user.userId,
      file,
    );
  }

  @Get()
  findAll() {
    return this.workspaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.update(+id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaceService.remove(+id);
  }
}
