import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
    imports:[SizeModule, DatabaseModule],
    controllers: [SizeController],
    providers: [SizeService, DatabaseService],
    exports: [SizeService]
})
export class SizeModule {}
