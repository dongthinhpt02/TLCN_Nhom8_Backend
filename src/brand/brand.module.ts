import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';

@Module({
  imports:[BrandModule, DatabaseModule, JwtModule, AuthModule],
  controllers: [BrandController],
  providers: [BrandService, DatabaseService, JwtService, AuthService],
  exports: [BrandService]
})
export class BrandModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyAccessTokenMiddleware)
    .forRoutes('brand');
}
}
