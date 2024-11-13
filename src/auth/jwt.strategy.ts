import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'legendsneverdie',
    });
  }

  async validate(payload: any) {
    // Bạn có thể thực hiện xác thực người dùng ở đây
    return { userId: payload.sub, username: payload.username };
  }
}
