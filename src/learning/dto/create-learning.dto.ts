import { IsString } from 'class-validator';

export class CreateLearningDto {
  @IsString()
  title: string;

  @IsString()
  body: string;
}
