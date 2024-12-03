import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDTO } from 'src/DTOs/CreateProduct.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductService {
    constructor(private readonly databaseService : DatabaseService){}

    async createProduct(createProductDTO : CreateProductDTO){
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newProduct = {
                ...createProductDTO,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
            };
            await db.collection('product').insertOne(newProduct);
            return newProduct;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updateProduct(updateProductDTO : CreateProductDTO){
        try {
            const db = this.databaseService.getDb();
            const updateProduct = {
                ...updateProductDTO,
                updatedAt: new Date(),
            }
            console.log(updateProduct);
            await db.collection('product').updateOne({ _id: new ObjectId(updateProductDTO._id) }, { $set: updateProduct });

            return updateProduct;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockProduct(id : string){
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('product').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock product or product not found');
            }
            return { message: 'Product locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restoreProduct(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('product').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore product or product not found');
            }
            return { message: 'Product restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllProduct() {
        try {
            const db = this.databaseService.getDb();
            const getAllNews = await db.collection('product').find().toArray();
            return getAllNews;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActiveProduct() {
        try {
            const db = this.databaseService.getDb();
            const getAllActiveNews = await db.collection('product').find(
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
    async searchProduct(keyword: string){
        try {
            const db = this.databaseService.getDb();
            const filter = {
                $or: [
                    {productName: { $regex: keyword, $options: 'i' } },
                    // {status : Status.ACTIVE},
                ],
                status : Status.ACTIVE,
            };
            const searchProduct = await db.collection('product').find(filter).toArray();
            return searchProduct;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
}
