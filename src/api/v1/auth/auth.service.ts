import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { hash, compare } from 'bcryptjs';
import { User } from '@prisma/client';
import { RegisterResponseDto } from './dto/response-dto';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { ApiResponseService } from '@/utils/api-response/api-response.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  // async validateUser(email: string, pass: string)

  // TODO: Set return type for all response bayad beshe {ok, data, message}
  async register(bodyData: RegisterDto): Promise<RegisterResponseDto | null> {
    const { email, name, password } = bodyData;

    this.logger.verbose(`Attempting to register with email: ${email}`);

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) throw new BadRequestException('Email already exists');

    const hashedPassword = await this.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      omit: {
        password: true,
      },
    });

    return plainToInstance(RegisterResponseDto, {
      email: user.email,
      joined_at: user.createdAt,
      name: user.name,
    });
  }

  async login(bodyData: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = bodyData;

    this.logger.verbose(`Attempting to login with email: ${email}`);
    const user = await this.findUserByEmail(email);
    if (!user) throw new BadRequestException('Email or password is incorrect');

    this.logger.verbose('password validation...', password);
    if (!(await this.verifyPassword(password, user.password)))
      throw new BadRequestException('Password or email is incorrect');

    return {
      accessToken: this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        { secret: process.env.JWT_SECRET },
      ),
    };
  }

  async finaAllUsers() {
    const data = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return this.apiResponse.success({ data });
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
