import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports : [CategoryModule, DatabaseModule, JwtModule],
    controllers : [CategoryController],
    providers : [CategoryService, DatabaseService, JwtService],
    exports : [CategoryService]
})
export class CategoryModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAccessTokenMiddleware)
        .forRoutes('cate');
    }
}
