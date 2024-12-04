import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { LockingproductitemController } from './lockingproductitem.controller';
import { LockingproductitemService } from './lockingproductitem.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from 'src/jwt/jwt.service';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';

@Module({
    imports: [LockingproductitemModule, DatabaseModule, JwtModule],
    controllers : [LockingproductitemController],
    providers: [LockingproductitemService, DatabaseService, JwtService]
})
export class LockingproductitemModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAccessTokenMiddleware)
        .forRoutes('lockingproductitem');
    }
}
