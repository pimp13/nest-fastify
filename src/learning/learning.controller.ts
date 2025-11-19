import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { LearningService } from './learning.service';
import { CreateLearningDto } from './dto/create-learning.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';

@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Post()
  create(@Body() bodyData: CreateLearningDto) {
    return bodyData;
  }
}
