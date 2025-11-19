import {
  Body,
  Controller,
  Get,
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
        httpOnly: true,
        maxAge: 259200, // 3 روز
        sameSite: 'lax',
        secure: false, // در https باید true شود
      },
    );

    return { message: 'your logged is ok', ok: true };
  }

  @UseGuards(JwtGuard)
  @Get('info')
  getProfile(@Req() req) {
    return req.user;
  }

  // @UseGuards(JwtGuard)
  @Get('users')
  async findAllUsers() {
    return this.authService.finaAllUsers();
  }
}
