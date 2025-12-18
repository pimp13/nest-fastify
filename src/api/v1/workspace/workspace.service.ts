import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiResponseService } from '@/utils/api-response/api-response.service';
import { slugify } from '@/utils/slugify';
import { TFile } from './dto/file.dto';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  async create(bodyData: CreateWorkspaceDto, userId: string, file: TFile) {
    this.logger.verbose('FILE =>', file);

    this.logger.verbose('Step 1: Check owner is existe.');
    const ownerId = bodyData.ownerId ? bodyData.ownerId : userId;

    this.logger.verbose('Step 2: Create a unique slug.');
    const slug = bodyData.slug
      ? await this.generateUniqueSlug(bodyData.slug)
      : await this.generateUniqueSlug(bodyData.name);

    this.logger.verbose('Step 3: Create and make a new WorkSpace.');
    await this.prisma.workSpace.create({
      data: {
        name: bodyData.name,
        slug,
        ownerId,
      },
    });

    return this.apiResponse.success({ message: 'WorkSpace is created!' });
  }

  async findAll() {
    const data = await this.prisma.workSpace.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: {
          omit: {
            password: true,
          },
        },
      },
    });
    if (!data) throw new NotFoundException('WorkSpace Is Not Found!');

    return this.apiResponse.success({ data });
  }

  async findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const existing = await this.prisma.workSpace.findUnique({
        where: { slug },
      });

      if (!existing) break;

      slug = `${baseSlug}-${count}`;
      count++;
    }

    return slug;
  }
}
