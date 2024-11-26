import {MiddlewareConsumer, Module,  } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtService } from 'src/jwt/jwt.service';
import { DatabaseService } from 'src/database/database.service';
import { DaysModule } from 'src/days/days.module';
import { DatabaseModule } from 'src/database/database.module';
import { DaysService } from 'src/days/days.service';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './Serializer';
import { VerifyAccessTokenMiddleware, VerifyRefreshTokenMiddleware } from 'src/middleware/auth.middleware';


@Module({
  imports: [DaysModule, JwtModule, DatabaseModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, DatabaseService, DaysService, GoogleStrategy, SessionSerializer],
  exports: [AuthService]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyRefreshTokenMiddleware)
      .forRoutes('auth/logout'); 
    consumer
      .apply(VerifyRefreshTokenMiddleware)
      .forRoutes('auth/refresh_refreshToken');
  }
}
