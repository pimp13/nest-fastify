import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiResponseService } from '@/utils/api-response/api-response.service';
import { slugify } from '@/utils/slugify';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  async create(bodyData: CreateProjectDto) {
    const slug = bodyData.slug
      ? await this.generateUniqueSlug(bodyData.slug)
      : await this.generateUniqueSlug(bodyData.name);

    await this.prisma.project.create({
      data: {
        name: bodyData.name,
        slug,
        workSpaceId: bodyData.workSpaceId,
      },
    });

    return this.apiResponse.success({ message: 'Project is created!' });
  }

  async findAll() {
    const data = await this.prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!data) throw new NotFoundException('project is not found!');

    return this.apiResponse.success({ data });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const existing = await this.prisma.project.findUnique({
        where: { slug },
      });

      if (!existing) break;

      slug = `${baseSlug}-${count}`;
      count++;
    }

    return slug;
  }
}
