import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import type { FastifyReply } from 'fastify/types/reply';
import { JwtGuard } from './jwt.guard';

@ApiTags('[Auth] User')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() bodyData: RegisterDto) {
    return this.authService.register(bodyData);
  }

  @Post('login')
  async login(
    @Body() bodyData: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const response = await this.authService.login(bodyData);
    res.setCookie(
      process.env.AUTH_COOKIE_NAME || '_token',
      response.accessToken,
      {
        path: '/',
        maxAge: 259200, // 3 روز
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    );

    return { message: 'your logged is ok', ok: true };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: FastifyReply) {
    res.clearCookie(process.env.AUTH_COOKIE_NAME || '_token', {
      path: '/',
      maxAge: 0, // 3 روز
      expires: new Date(0),
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      ok: true,
      message: 'your are logouted',
    };
  }

  @UseGuards(JwtGuard)
  @Get('info')
  async getProfile(@Req() req) {
    return this.authService.findUserInfoById(req.user.userId);
  }

  // @UseGuards(JwtGuard)
  @Get('users')
  async findAllUsers() {
    return this.authService.finaAllUsers();
  }
}
