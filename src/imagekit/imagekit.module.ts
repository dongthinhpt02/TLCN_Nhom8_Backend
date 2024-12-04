import { Module } from '@nestjs/common';
import { JwtModule } from 'src/jwt/jwt.module';
import { ImageKitService } from './imagekit.service';
import { JwtService } from 'src/jwt/jwt.service';
import { DatabaseModule } from 'src/database/database.module';
import { ImageKitController } from './imagekit.controller';
import { DatabaseService } from 'src/database/database.service';

// @Module({
//     imports: [JwtModule, JwtService],
//     controllers: [ImageKitController],
//     providers: [ImageKitService, JwtService],
//     exports: [ImageKitService],
// })

@Module({
    imports: [JwtModule, DatabaseModule],
    controllers: [ImageKitController],
    providers: [ImageKitService, JwtService, DatabaseService],
    exports: [ImageKitService]
})
export class ImageKitModule {}
