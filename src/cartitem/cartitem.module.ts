import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { CartitemController } from './cartitem.controller';
import { CartitemService } from './cartitem.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports:[CartitemModule, DatabaseModule, JwtModule],
    controllers:[CartitemController],
    providers : [CartitemService, DatabaseService, JwtService],
    exports: [CartitemService]
})
export class CartitemModule {}
