import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from 'src/jwt/jwt.service';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';

@Module({
    imports: [DatabaseModule, JwtModule, AuthModule],
    controllers: [AddressController],
    providers: [AddressService, AuthService, JwtService],
    exports: [AddressService]
})
export class AddressModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAccessTokenMiddleware)
        .forRoutes('address');
    }
}
