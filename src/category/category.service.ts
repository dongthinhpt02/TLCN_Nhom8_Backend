import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDTO } from 'src/DTOs/CreateCategory.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class CategoryService {
    constructor(private readonly databaseService: DatabaseService) {
    }
    async createCategory(createCategoryDTO: CreateCategoryDTO) {
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newCate = {
                ...createCategoryDTO,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
            };
            await db.collection('category').insertOne(newCate);
            return newCate;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updateCategory(updateCategoryDTO: CreateCategoryDTO) {
        try {
            const db = this.databaseService.getDb();
            const updateCate = {
                ...updateCategoryDTO,
                updatedAt: new Date(),
            }
            console.log(updateCate);
            await db.collection('category').updateOne({ _id: new ObjectId(updateCategoryDTO._id) }, { $set: updateCate });

            return updateCate;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockCategory(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('category').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock category or category not found');
            }
            return { message: 'Category locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restoreCategory(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('category').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore category or category not found');
            }
            return { message: 'Category restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllCate() {
        try {
            const db = this.databaseService.getDb();
            const getAllCate = await db.collection('category').find().toArray();
            return getAllCate;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActiveCate() {
        try {
            const db = this.databaseService.getDb();
            const getAllActiveCate = await db.collection('category').find(
                {
                    status: Status.ACTIVE
                }
            )
            .toArray();
            return getAllActiveCate;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getDetailCate(id : string){
        try {
            const db = this.databaseService.getDb()
            const getDetailCate = await db.collection('category').findOne({
                _id : new ObjectId(id),
            });
            return getDetailCate;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async searchCate(keyword: string){
        try {
            const db = this.databaseService.getDb();
            const filter = {
                $or: [
                    {cateName: { $regex: keyword, $options: 'i' } },
                    // {status : Status.ACTIVE},
                ],
                status : Status.ACTIVE,
            };
            const searchCate = await db.collection('category').find(filter).toArray();
            return searchCate;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
}
