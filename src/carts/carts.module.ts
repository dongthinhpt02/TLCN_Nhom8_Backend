import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports : [CartsModule, DatabaseModule, JwtModule],
    controllers : [CartsController],
    providers : [CartsService, DatabaseService, JwtService],
    exports : [CartsService]
})
export class CartsModule {}
