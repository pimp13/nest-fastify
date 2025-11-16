import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty()
  @MinLength(4, { message: 'نام بخش حداقل باید 4 کاراکتر باید باشه' })
  @MaxLength(190, { message: 'نام بخش زیادی طولانی هست' })
  name: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;
}
