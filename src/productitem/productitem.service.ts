import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductItemDTO } from 'src/DTOs/CreateProductItem.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';
import { error } from 'console';

@Injectable()
export class ProductitemService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createProductItem(createProductItemDTO: CreateProductItemDTO) {
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
    async updateProductItem(updateProductItemDTO: CreateProductItemDTO) {
        try {
            const db = this.databaseService.getDb();
            const updateProductItem = {
                ...updateProductItemDTO,
                updatedAt: new Date(),
            }
            console.log(updateProductItem);
            await db.collection('productitem').updateOne({ _id: new ObjectId(updateProductItemDTO._id) }, { $set: updateProductItem });

            return updateProductItem;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockProductItem(id: string) {
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
    async searchProductItem(keyword: string) {
        try {
            const db = this.databaseService.getDb();
            const filter = {
                $or: [
                    { productItemName: { $regex: keyword, $options: 'i' } },
                    // {status : Status.ACTIVE},
                ],
                status: Status.ACTIVE,
            };
            const searchProductItem = await db.collection('productitem').find(filter).toArray();
            return searchProductItem;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async findProductItemByColorName(keyword: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('productitem').aggregate([
                {
                    $lookup: {
                        from: 'color', // Tên collection Color
                        localField: 'colorId', // Liên kết từ trường color_id trong ProductItem
                        foreignField: '_id', // Liên kết đến _id trong Color
                        as: 'color', // Tên mảng kết quả sau khi lookup
                    },
                },
                {
                    $unwind: '$color', // Bóc tách mảng `color` thành đối tượng
                },
                {
                    $match: {
                        'color.colorName': { $regex: keyword, $options: 'i' }, // Điều kiện lọc theo colorName
                        'color.status': Status.ACTIVE, // Điều kiện lọc status của Color (ACTIVE = 1)
                        status: Status.ACTIVE, // Điều kiện lọc status của ProductItem (ACTIVE = 1)
                    },
                },
                {
                    $project: {
                        _id: 1,
                        productItemName: 1,
                        price: 1,
                        quantity: 1,
                        description: 1,
                        imgProductItem: 1,
                        status: 1,
                        createdAt: 1,
                        colorName: '$color.colorName',
                    },
                },
            ]).toArray();
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async findProductItemsBySizeName(keyword: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('productitem').aggregate([
                {
                    $lookup: {
                        from: 'size', // Tên collection Size
                        localField: 'sizeId', // Trường liên kết với _id trong Size
                        foreignField: '_id', // Trường đối ứng trong collection Size
                        as: 'size', // Tên mảng chứa kết quả
                    },
                },
                { $unwind: '$size' }, // Bóc tách mảng size thành đối tượng
                {
                    $match: {
                        'size.sizeName': { $regex: keyword, $options: 'i' }, // Lọc theo sizeName
                        status: Status.ACTIVE, // Trạng thái của ProductItem phải là active
                        'size.status': Status.ACTIVE, // Trạng thái của Size phải là active
                    },
                },
                {
                    $project: {
                        _id: 1,
                        productItemName: 1,
                        price: 1,
                        quantity: 1,
                        sizeName: '$size.sizeName', // Lấy thông tin sizeName từ mảng size
                    },
                },
            ]).toArray();
            return result;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async findProductItemByBrandName(keyword: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('productitem').aggregate([
                {
                    $lookup: {
                        from: 'product', // Tên collection Product
                        localField: 'productId', // Trường liên kết với _id trong Product
                        foreignField: '_id', // Trường đối ứng trong collection Product
                        as: 'product', // Tên mảng chứa kết quả
                    },
                },
                { $unwind: '$product' }, // Bóc tách mảng product thành đối tượng
                {
                    $lookup: {
                        from: 'brand', // Tên collection Brand
                        localField: 'product.brandId', // Trường liên kết với brandId trong Product
                        foreignField: '_id', // Trường đối ứng trong collection Brand
                        as: 'brand', // Tên mảng chứa kết quả
                    },
                },
                { $unwind: '$brand' }, // Bóc tách mảng brand thành đối tượng
                {
                    $match: {
                        'brand.brandName': { $regex: keyword, $options: 'i' }, // Lọc theo brandName
                        status: 1, // Trạng thái của ProductItem phải là active
                        'product.status': 1, // Trạng thái của Product phải là active
                        'brand.status': 1, // Trạng thái của Brand phải là active
                    },
                },
                {
                    $project: {
                        _id: 1,
                        productItemName: 1,
                        price: 1,
                        description: 1,
                        quantity: 1,
                        status: 1,
                        brandName: '$brand.brandName', // Lấy thông tin brandName từ mảng brand
                        country:'$brand.country',
                        descriptionBrand: '$brand.description',
                        productName: '$product.productName',
                    },
                },
            ]).toArray();
            return result;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async findProductItemByCateName(keyword: string) {
        const db = this.databaseService.getDb();
        const result = await db.collection('productitem').aggregate([
            {
                $lookup: {
                    from: 'product', // Tên collection Product
                    localField: 'productId', // Trường liên kết với _id trong Product
                    foreignField: '_id', // Trường đối ứng trong collection Product
                    as: 'product', // Tên mảng chứa kết quả
                },
            },
            { $unwind: '$product' }, // Bóc tách mảng product thành đối tượng
            {
                $lookup: {
                    from: 'category', // Tên collection Category
                    localField: 'product.cateId', // Trường liên kết với cateId trong Product
                    foreignField: '_id', // Trường đối ứng trong collection Category
                    as: 'category', // Tên mảng chứa kết quả
                },
            },
            { $unwind: '$category' }, // Bóc tách mảng category thành đối tượng
            {
                $match: {
                    'category.cateName': { $regex: keyword, $options: 'i' },
                    status: 1, // Trạng thái của ProductItem phải là active
                    'product.status': 1, // Trạng thái của Product phải là active
                    'category.status': 1, // Trạng thái của Category phải là active
                },
            },
            {
                $project: {
                    _id: 1,
                    productItemName: 1,
                    price: 1,
                    description: 1,
                    quantity: 1,
                    status: 1,
                    cateName: '$category.cateName', // Lấy thông tin brandName từ mảng brand
                    productName: '$product.productName', // Lấy thông tin cateName từ mảng category
                },
            },
        ]).toArray();
        return result;
    } catch(error) {
        throw new CustomException(error.message);
    }
    async findProductItemByProductName(keyword : string){
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('productitem').aggregate([
                {
                    $lookup: {
                        from: 'product', // Tên collection Size
                        localField: 'productId', // Trường liên kết với _id trong Size
                        foreignField: '_id', // Trường đối ứng trong collection Size
                        as: 'product', // Tên mảng chứa kết quả
                    },
                },
                { $unwind: '$product' }, // Bóc tách mảng size thành đối tượng
                {
                    $match: {
                        'product.productName': { $regex: keyword, $options: 'i' }, // Lọc theo sizeName
                        status: Status.ACTIVE, // Trạng thái của ProductItem phải là active
                        'product.status': Status.ACTIVE, // Trạng thái của Size phải là active
                    },
                },
                {
                    $project: {
                        _id: 1,
                        productItemName: 1,
                        price: 1,
                        quantity: 1,
                        productName: '$product.productName', // Lấy thông tin sizeName từ mảng size
                    },
                },
            ]).toArray();
            return result;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getDetailProductItem(id : string){
        try {
            const db = this.databaseService.getDb()
            const getDetailProductItem = await db.collection('productitem').findOne({
                _id : new ObjectId(id),
            });
            return getDetailProductItem;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
}


