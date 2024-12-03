import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductItemDTO } from 'src/DTOs/CreateProductItem.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductitemService {
    constructor(private readonly databaseService : DatabaseService){}

    async createProductItem(createProductItemDTO : CreateProductItemDTO){
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newProductItem = {
                ...createProductItemDTO,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
            };
            await db.collection('productitem').insertOne(newProductItem);
            return newProductItem;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updateProductItem(updateProductItemDTO : CreateProductItemDTO){
        try {
            const db = this.databaseService.getDb();
            const updateProductItem = {
                ...updateProductItemDTO,
                updatedAt: new Date(),
            }
            console.log(updateProductItem);
            await db.collection('product').updateOne({ _id: new ObjectId(updateProductItemDTO._id) }, { $set: updateProductItem });

            return updateProductItem;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockProductItem(id : string){
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('productitem').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock productitem or productitem not found');
            }
            return { message: 'ProductItem locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restoreProductItem(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('productitem').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore productitem or productitem not found');
            }
            return { message: 'ProductItem restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllProductItem() {
        try {
            const db = this.databaseService.getDb();
            const getAllNews = await db.collection('productitem').find().toArray();
            return getAllNews;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActiveProductItem() {
        try {
            const db = this.databaseService.getDb();
            const getAllActiveNews = await db.collection('productitem').find(
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
    async searchProductItem(keyword: string){
        try {
            const db = this.databaseService.getDb();
            const filter = {
                $or: [
                    {productItemName: { $regex: keyword, $options: 'i' } },
                    // {status : Status.ACTIVE},
                ],
                status : Status.ACTIVE,
            };
            const searchProductItem = await db.collection('productitem').find(filter).toArray();
            return searchProductItem;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
}
