import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty()
  @MinLength(4, { message: 'نام فضای کار باید بالای 4 کاراکتر باشه' })
  @MaxLength(190, { message: 'نام فضای کار زیادی طولانی هست' })
  name: string;

  @ApiProperty()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsOptional()
  ownerId?: string;
}
