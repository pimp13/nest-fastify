import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from '@/prisma/prisma.service';
import {
  ApiResponse,
  ApiResponseService,
} from '@/utils/api-response/api-response.service';
import { slugify } from '@/utils/slugify';
import { TFile } from './dto/file.dto';
import { ConfigService } from '@nestjs/config';
import { WorkspaceResponse } from './dto/response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiResponse: ApiResponseService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    bodyData: CreateWorkspaceDto,
    userId: string,
    file: TFile,
  ): Promise<ApiResponse<null>> {
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
        imageUrl: file.url,
      },
    });

    return this.apiResponse.success({ message: 'WorkSpace is created!' });
  }

  async findAll(userId: string): Promise<ApiResponse<WorkspaceResponse[]>> {
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
      where: {
        ownerId: userId,
      },
    });

    const finalData = plainToInstance(WorkspaceResponse, data, {
      excludeExtraneousValues: false,
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    });

    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:9090';

    finalData.forEach((item) => {
      item.fullDestination = `${appUrl}${item.imageUrl}`;
    });

    return this.apiResponse.success({ data: finalData });
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
