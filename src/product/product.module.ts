import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
    imports:[ProductModule, DatabaseModule],
    controllers:[ProductController],
    providers:[ProductService, DatabaseService],
    exports:[ProductService]
})
export class ProductModule {}
