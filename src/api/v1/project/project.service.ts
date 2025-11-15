import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponseService } from 'src/utils/api-response/api-response.service';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  async create(
    bodyData: CreateProjectDto,
    userId: string,
  ): Promise<ApiResponseService> {
    this.logger.verbose('Create a new project...');

    await this.prisma.project.create({
      data: {
        name: bodyData.name,
        key: bodyData.key.toUpperCase(),
        description: bodyData.description,
        ownerId: userId,
      },
    });

    return this.apiResponse.success({ message: 'created a new project' });
  }

  async getCurrentUserProjects(userId: string): Promise<ApiResponseService> {
    const data = await this.prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: true,
      },
    });
    if (!data) throw new NotFoundException('NotFound Projects For User');
    return this.apiResponse.success({ data });
  }

  async findOne(id: string) {
    const data = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });
    if (!data) throw new NotFoundException('Project is not found!');

    return this.apiResponse.success({ data });
  }

  async update(id: string, bodyData: UpdateProjectDto) {
    await this.prisma.project.update({
      where: { id },
      data: {
        name: bodyData.name,
        key: bodyData.key?.toUpperCase(),
        description: bodyData.description,
      },
    });

    return this.apiResponse.success({ message: 'Project is updated!' });
  }

  async remove(id: string) {
    await this.prisma.project.delete({
      where: { id },
    });

    return this.apiResponse.success({ message: 'project is deleted!' });
  }
}
