import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtController } from './jwt.controller';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports : [DatabaseModule],
    controllers : [JwtController],
    providers: [JwtService, DatabaseService],
    exports: [JwtService]
    // CAI EXPORT NAY HINH EXPORT RA DE CHO MAY THANG KIA NO XAI, BUA T DOC LA NO NOI NHU V 
})
export class JwtModule {}
//JwtModule
//TU DUNG NO TU LAN RA LOI A :V