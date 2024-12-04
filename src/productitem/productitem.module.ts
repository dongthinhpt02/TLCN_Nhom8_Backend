import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductitemService } from './productitem.service';
import { DatabaseService } from 'src/database/database.service';
import { ProductitemController } from './productitem.controller';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports: [ProductitemModule, DatabaseModule, JwtModule],
    controllers : [ProductitemController],
    providers : [ProductitemService, DatabaseService, JwtService],
    exports : [ProductitemService]
})
export class ProductitemModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAccessTokenMiddleware)
        .forRoutes('productitem');
    }
}
