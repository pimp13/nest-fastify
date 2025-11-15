import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          return req?.cookies?._token || null;
        },
      ]),
      //   ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload) throw new UnauthorizedException('you not logged');
    // payload = { sub: userId, email: ... }
    return { userId: payload.sub, email: payload.email };
    // این آبجکت به request.user اضافه می‌شود
  }
}
