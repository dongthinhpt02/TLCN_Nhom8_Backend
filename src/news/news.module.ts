import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { DatabaseService } from 'src/database/database.service';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports : [NewsModule, DatabaseModule, JwtModule],
    controllers : [NewsController],
    providers : [NewsService, DatabaseService, JwtService],
    exports : [NewsService]
})
export class NewsModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAccessTokenMiddleware)
        .forRoutes('news');
    }
}
