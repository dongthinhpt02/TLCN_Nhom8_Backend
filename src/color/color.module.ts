import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { DatabaseService } from 'src/database/database.service';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports:[ColorModule, DatabaseModule, JwtModule],
    controllers:[ColorController],
    providers:[ColorService, DatabaseService, JwtService],
    exports:[ColorService]
})
export class ColorModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAccessTokenMiddleware)
        .forRoutes('color');
    }
}
