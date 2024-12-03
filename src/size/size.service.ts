import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateSizeDTO } from 'src/DTOs/CreateSize.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class SizeService {
    constructor(private readonly databaseService : DatabaseService){}

    async createSize(createSizeDTO : CreateSizeDTO){
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newSize = {
                ...createSizeDTO,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
            };
            await db.collection('size').insertOne(newSize);
            return newSize;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updateSize(updateSizeDTO : CreateSizeDTO){
        try {
            const db = this.databaseService.getDb();
            const updateSize = {
                ...updateSizeDTO,
                updatedAt: new Date(),
            }
            console.log(updateSize);
            await db.collection('size').updateOne({ _id: new ObjectId(updateSizeDTO._id) }, { $set: updateSize });

            return updateSize;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockSize(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('size').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock size or size not found');
            }
            return { message: 'Size locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restoreSize(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('size').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore size or size not found');
            }
            return { message: 'Size restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllSize() {
        try {
            const db = this.databaseService.getDb();
            const getAllSize = await db.collection('size').find().toArray();
            return getAllSize;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActiveSize() {
        try {
            const db = this.databaseService.getDb();
            const getAllActiveSize = await db.collection('size').find(
                {
                    status: Status.ACTIVE
                }
            )
            .toArray();
            return getAllActiveSize;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
}
