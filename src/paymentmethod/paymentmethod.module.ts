import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { PaymentmethodController } from './paymentmethod.controller';
import { PaymentmethodService } from './paymentmethod.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from 'src/jwt/jwt.service';
import { VerifyAccessTokenMiddleware } from 'src/middleware/auth.middleware';

@Module({
    imports : [PaymentmethodModule, DatabaseModule, JwtModule],
    controllers : [PaymentmethodController],
    providers : [PaymentmethodService, DatabaseService, JwtService],
    exports : [PaymentmethodService]
})
export class PaymentmethodModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(VerifyAccessTokenMiddleware)
        .forRoutes('paymentmethod');
    }
}
