import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseService } from 'src/utils/api-response/api-response.service';

@Injectable()
export class SectionService {
  private readonly logger = new Logger(SectionService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  async create(bodyData: CreateSectionDto) {
    await this.prisma.section.create({
      data: {
        name: bodyData.name,
        projectId: bodyData.projectId,
      },
    });

    return this.apiResponse.success({ message: 'بخش با موفقیت ثبت شد' });
  }

  async findAll() {
    const data = await this.prisma.section.findMany({
      include: {
        project: {
          include: {
            workSpace: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
    if (!data) throw new NotFoundException('Section is notfound');

    return this.apiResponse.success({ data });
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
