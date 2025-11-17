import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectTeamDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}
