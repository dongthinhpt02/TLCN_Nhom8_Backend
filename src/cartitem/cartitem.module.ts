import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { CartitemController } from './cartitem.controller';
import { CartitemService } from './cartitem.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from 'src/jwt/jwt.service';
import { CartsModule } from 'src/carts/carts.module';
import { CartsService } from 'src/carts/carts.service';

@Module({
    imports:[CartitemModule, DatabaseModule, JwtModule, CartsModule],
    controllers:[CartitemController],
    providers : [CartitemService, DatabaseService, JwtService, CartsService],
    exports: [CartitemService]
})
export class CartitemModule {}
