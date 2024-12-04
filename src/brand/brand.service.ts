import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBrandDTO } from 'src/DTOs/CreateBrand.dto';
import { Status } from 'src/enum/enum.status.user';
import { ObjectId } from 'mongodb';
import { CustomException } from 'src/exception/CustomException';

@Injectable()
export class BrandService {
    constructor(private readonly databaseService: DatabaseService) {
    }
    async createBrand(createBrandDto: CreateBrandDTO) {
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newBrand = {
                ...createBrandDto,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
            };
            await db.collection('brand').insertOne(newBrand);
            return newBrand;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updateBrand(updateBrandDto: CreateBrandDTO) {
        try {
            const db = this.databaseService.getDb();
            const updateBrand = {
                ...updateBrandDto,
                updatedAt: new Date(),
            }
            console.log(updateBrand);
            await db.collection('brand').updateOne({ _id: new ObjectId(updateBrandDto._id) }, { $set: updateBrand });

            return updateBrand;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockBrand(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('brand').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock brand or brand not found');
            }
            return { message: 'Brand locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restoreBrand(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('brand').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore brand or brand not found');
            }
            return { message: 'Brand restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllBrand() {
        try {
            const db = this.databaseService.getDb();
            const getAllBrand = await db.collection('brand').find().toArray();
            return getAllBrand;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActiveBrand() {
        try {
            const db = this.databaseService.getDb();
            const getAllActiveBrand = await db.collection('brand').find(
                {
                    status: Status.ACTIVE
                }
            )
            .toArray();
            return getAllActiveBrand;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getDetailBrand(id : string){
        try {
            const db = this.databaseService.getDb()
            const getDetailBrand = await db.collection('brand').findOne({
                _id : new ObjectId(id),
            });
            return getDetailBrand;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async searchBrand(keyword: string){
        try {
            const db = this.databaseService.getDb();
            const filter = {
                $or: [
                    {country: { $regex: keyword, $options: 'i' } },
                    {brandName: { $regex: keyword, $options: 'i' } },
                    // {status : Status.ACTIVE},
                ],
                status : Status.ACTIVE,
            };
            const searchBrand = await db.collection('brand').find(filter).toArray();
            return searchBrand;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    
}
