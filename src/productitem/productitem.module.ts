import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductController } from 'src/product/product.controller';
import { ProductitemService } from './productitem.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
    imports: [ProductitemModule, DatabaseModule],
    controllers : [ProductController],
    providers : [ProductitemService, DatabaseService],
    exports : [ProductitemService]
})
export class ProductitemModule {}
