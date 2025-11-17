import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @MinLength(4, { message: 'نام فضای کار باید بالای 4 کاراکتر باشه' })
  @MaxLength(190, { message: 'نام فضای کار زیادی طولانی هست' })
  name!: string;

  @ApiProperty()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsUUID()
  workSpaceId!: string;
}
