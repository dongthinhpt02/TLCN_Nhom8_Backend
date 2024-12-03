import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePromotionDTO } from 'src/DTOs/CreatePromotion.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class PromotionService {
    constructor(private readonly databaseService : DatabaseService){}
    async createPromotion(createPromotionDTO : CreatePromotionDTO){
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newPromo = {
                ...createPromotionDTO,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
            };
            await db.collection('promotion').insertOne(newPromo);
            return newPromo;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async updatePromotion(updatePromotionDTO : CreatePromotionDTO){
        try {
            const db = this.databaseService.getDb();
            const updatePromo = {
                ...updatePromotionDTO,
                updatedAt: new Date(),
            }
            console.log(updatePromo);
            await db.collection('promotion').updateOne({ _id: new ObjectId(updatePromotionDTO._id) }, { $set: updatePromo });

            return updatePromo;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockPromotin(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('promotion').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock promotion or promotion not found');
            }
            return { message: 'Promotion locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restorePromotion(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('promotion').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore promotion or promotion not found');
            }
            return { message: 'Promotion restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllPromotion() {
        try {
            const db = this.databaseService.getDb();
            const getAllNews = await db.collection('promotion').find().toArray();
            return getAllNews;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActivePromotion() {
        try {
            const db = this.databaseService.getDb();
            const getAllActiveNews = await db.collection('promotion').find(
                {
                    status: Status.ACTIVE
                }
            )
            .toArray();
            return getAllActiveNews;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
}
