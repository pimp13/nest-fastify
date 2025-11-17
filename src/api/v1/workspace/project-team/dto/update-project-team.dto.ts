import { PartialType } from '@nestjs/swagger';
import { CreateProjectTeamDto } from './create-project-team.dto';

export class UpdateProjectTeamDto extends PartialType(CreateProjectTeamDto) {}
