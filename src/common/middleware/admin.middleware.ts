import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    try {
      const token = req.cookies._token;
      if (!token) throw new UnauthorizedException('no token');
      console.log('TOKEN =>', token);
    } catch (err: any) {}

    next();
  }
}
