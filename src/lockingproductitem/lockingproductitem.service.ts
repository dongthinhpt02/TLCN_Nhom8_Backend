import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateLockingProductItemDTO } from 'src/DTOs/CreateLockingProductItem.dto';
import { CustomException } from 'src/exception/CustomException';

@Injectable()
export class LockingproductitemService {
    constructor(private readonly databaseService : DatabaseService){

    }

    async createLockingProductItem(createLockingProductItemDTO : CreateLockingProductItemDTO){
        try {
            const db = this.databaseService.getDb()
            const expire = new Date()
            expire.setMinutes(expire.getMinutes() + 5);
            const newLocking = {
                ...createLockingProductItemDTO,
                expiredAt : expire
            }
            await db.collection('lockingproduct').insertOne(newLocking);
            return newLocking;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async deleteLockProductItem(id : string){

    }
}
