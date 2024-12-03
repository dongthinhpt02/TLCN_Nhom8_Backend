import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
    imports:[ColorModule, DatabaseModule],
    controllers:[ColorController],
    providers:[ColorService, DatabaseService],
    exports:[ColorService]
})
export class ColorModule {}
