import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectTeamService } from './project-team.service';
import { CreateProjectTeamDto } from './dto/create-project-team.dto';
import { UpdateProjectTeamDto } from './dto/update-project-team.dto';

@Controller('project-team')
export class ProjectTeamController {
  constructor(private readonly projectTeamService: ProjectTeamService) {}

  @Post()
  create(@Body() createProjectTeamDto: CreateProjectTeamDto) {
    return this.projectTeamService.create(createProjectTeamDto);
  }

  @Get()
  findAll() {
    return this.projectTeamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectTeamService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectTeamDto: UpdateProjectTeamDto,
  ) {
    return this.projectTeamService.update(+id, updateProjectTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectTeamService.remove(+id);
  }
}
