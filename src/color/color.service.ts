import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateColorDTO } from 'src/DTOs/CreateColor.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class ColorService {
    constructor(private readonly databaseService : DatabaseService){}

    async createColor(createColorDTO : CreateColorDTO){
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newColor = {
                ...createColorDTO,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
            };
            await db.collection('color').insertOne(newColor);
            return newColor;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updateColor(updateColorDTO : CreateColorDTO){
        try {
            const db = this.databaseService.getDb();
            const updateColor = {
                ...updateColorDTO,
                updatedAt: new Date(),
            }
            console.log(updateColor);
            await db.collection('color').updateOne({ _id: new ObjectId(updateColorDTO._id) }, { $set: updateColor });

            return updateColor;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockColor(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('color').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock color or color not found');
            }
            return { message: 'Color locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restoreColor(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('color').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore color or color not found');
            }
            return { message: 'Color restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllColor() {
        try {
            const db = this.databaseService.getDb();
            const getAllColor = await db.collection('color').find().toArray();
            return getAllColor;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActiveColor() {
        try {
            const db = this.databaseService.getDb();
            const getAllActiveColor = await db.collection('color').find(
                {
                    status: Status.ACTIVE
                }
            )
            .toArray();
            return getAllActiveColor;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getDetailColor(id : string){
        try {
            const db = this.databaseService.getDb()
            const getDetailColor = await db.collection('color').findOne({
                _id : new ObjectId(id),
            });
            return getDetailColor;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
}
