import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
    imports : [NewsModule, DatabaseModule],
    controllers : [NewsController],
    providers : [NewsService, DatabaseService],
    exports : [NewsService]
})
export class NewsModule {}
