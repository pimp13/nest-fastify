import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(2, { message: 'Project name must be at least 2 characters' })
  @MaxLength(50, {
    message: 'Project name cannot be longer than 10 characters',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(2, { message: 'Project key must be at least 2 characters' })
  @MaxLength(35, { message: 'Project key cannot be longer than 10 characters' })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Project key must contain only English letters',
  })
  key: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
}
