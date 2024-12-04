import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseService } from 'src/database/database.service';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports:[ProductModule, DatabaseModule, JwtModule],
    controllers:[ProductController],
    providers:[ProductService, DatabaseService, JwtService],
    exports:[ProductService]
})
export class ProductModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAccessTokenMiddleware)
        .forRoutes('product');
    }
}
