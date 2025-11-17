import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectTeamDto } from './dto/create-project-team.dto';
import { UpdateProjectTeamDto } from './dto/update-project-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApiResponse,
  ApiResponseService,
} from 'src/utils/api-response/api-response.service';

@Injectable()
export class ProjectTeamService {
  private readonly logger = new Logger(ProjectTeamService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  async create(
    bodyData: CreateProjectTeamDto,
  ): Promise<ApiResponse<{ message: string }>> {
    if (!(await this.existsProjectById(bodyData.projectId)))
      throw new BadRequestException(
        'BodyData is bad request project id is bad.',
      );

    if (!(await this.existsUserById(bodyData.userId)))
      throw new BadRequestException('BodyData is bad request user id is bad.');

    await this.prisma.projectTeam.create({
      data: {
        projectId: bodyData.projectId,
        userId: bodyData.userId,
      },
    });

    return this.apiResponse.success({
      message: 'Project Team is created successfully!',
    });
  }

  async findAll(): Promise<
    ApiResponse<
      {
        id: string;
        projectId: string;
        userId: string;
      }[]
    >
  > {
    const data = await this.prisma.projectTeam.findMany({
      orderBy: {
        id: 'desc',
      },
    });
    if (!data) throw new NotFoundException('Project Team is not found!');

    return this.apiResponse.success({ data });
  }

  findOne(id: number) {
    return `This action returns a #${id} projectTeam`;
  }

  update(id: number, updateProjectTeamDto: UpdateProjectTeamDto) {
    return `This action updates a #${id} projectTeam`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectTeam`;
  }

  private async existsProjectById(projectId: string): Promise<boolean> {
    const exists = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (exists) return true;
    return false;
  }

  private async existsUserById(userId: string): Promise<boolean> {
    const exists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (exists) return true;
    return false;
  }
}
