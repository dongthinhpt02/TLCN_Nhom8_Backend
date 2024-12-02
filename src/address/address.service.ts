import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAddressDTO } from 'src/DTOs/CreateAddress.dto';
import { Status } from 'src/enum/enum.status.user';
import { ObjectId } from 'mongodb';
import { CustomException } from 'src/exception/CustomException';
import { find } from 'rxjs';

@Injectable()
export class AddressService {
    constructor(private readonly databaseService: DatabaseService) {
    }
    async createAddress(createAddressDto: CreateAddressDTO) {
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newAddress = {
                ...createAddressDto,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deleteAt: null,
            };
            await db.collection('address').insertOne(newAddress);
            return newAddress;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updateAddress(updateAddressDto: CreateAddressDTO) {
        try {
            const db = this.databaseService.getDb();
            const updateAddress = {
                ...updateAddressDto,
                updatedAt: new Date(),
            }
            console.log(updateAddress);
            await db.collection('address').updateOne({ _id: new ObjectId(updateAddressDto._id) }, { $set: updateAddress });

            return updateAddress;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockAddress(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('address').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status : Status.INACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock address or address not found');
            }
            return { message: 'Address locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restoreAddress(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('address').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status : Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore address or address not found');
            }
            return { message: 'Address restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllAddress() {
        try {
            const db = this.databaseService.getDb();
            const getAllAddress = await db.collection('address').find().toArray(); // Chuyển Cursor thành mảng
            return getAllAddress;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAddressByKeyword(keyword: string) {
        try {
            const db = this.databaseService.getDb();
            const filter = {
                $or: [
                    { address: { $regex: keyword, $options: 'i' } },
                    { user_id: { $regex: keyword, $options: 'i' } },
                ],
            };

            const results = await db.collection('address').find(filter).toArray();
            return results;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
}
