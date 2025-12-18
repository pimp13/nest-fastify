import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { ApiResponseService } from '@/utils/api-response/api-response.service';

@Module({
  controllers: [SectionController],
  providers: [SectionService, ApiResponseService],
})
export class SectionModule {}
