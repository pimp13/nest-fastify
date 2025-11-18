import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();

    const token = req.cookies?._token;
    if (!token) throw new UnauthorizedException('Not Token Found');
    console.log('TOKEN IS =>', token);

    try {
      // ۲. verify کردن توکن
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // ۳. چک کردن نقش کاربر
      if (payload.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Access denied: admins only');
      }

      // ۴. ست کردن user در request برای استفاده در controller
      (req as any).user = payload;

      return true;
    } catch (err) {
      console.error(`error in admin guard: ${err}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
