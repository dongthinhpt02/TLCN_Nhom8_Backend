import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
    imports : [PromotionModule, DatabaseModule],
    controllers : [PromotionController],
    providers : [PromotionService, DatabaseService],
    exports : [PromotionService]
})
export class PromotionModule {}
