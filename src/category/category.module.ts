import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
    imports : [CategoryModule, DatabaseModule],
    controllers : [CategoryController],
    providers : [CategoryService, DatabaseService],
    exports : [CategoryService]
})
export class CategoryModule {
}
