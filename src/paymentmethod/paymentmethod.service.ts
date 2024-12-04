import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePaymentMethodDTO } from 'src/DTOs/CreatePaymentMethod.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class PaymentmethodService {
    constructor(private readonly databaseService : DatabaseService){}

    async createPaymentMethod(createpaymentmethodDTO : CreatePaymentMethodDTO){
        try {
            const db = this.databaseService.getDb()
            const status = Status.ACTIVE;
            const createPaymentMethod = {
                ...createpaymentmethodDTO,
                createdAt : new Date(),
                status : status,
                updatedAt : null,
                deletedAt : null
            }
            await db.collection('paymentmethod').insertOne(createPaymentMethod)
            return createPaymentMethod
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updatePaymentMethod(updatepaymentmethodDTO : CreatePaymentMethodDTO){
        try {
            const db = this.databaseService.getDb()
            const updatePaymentMethod = {
                ...updatepaymentmethodDTO,
                updatedAt : new Date()
            }
            await db.collection('paymentmethod').updateOne({_id: new ObjectId(updatepaymentmethodDTO._id)},{$set: updatePaymentMethod})
            return updatePaymentMethod;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async lockPaymentMethod(id: string){
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('paymentmethod').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock payment method or payment method not found');
            }
            return { message: 'Payment method locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restorePaymentMethod(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('paymentmethod').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore payment method or payment method not found');
            }
            return { message: 'Payment method restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllPaymentMethod() {
        try {
            const db = this.databaseService.getDb();
            const getAllPaymentMethod = await db.collection('paymentmethod').find().toArray();
            return getAllPaymentMethod;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActivePaymentMethod() {
        try {
            const db = this.databaseService.getDb();
            const getAllActivePaymentMethod = await db.collection('paymentmethod').find(
                {
                    status: Status.ACTIVE
                }
            )
            .toArray();
            return getAllActivePaymentMethod;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getDetailPaymentMethod(id : string){
        try {
            const db = this.databaseService.getDb()
            const getDetailPaymentMethod = await db.collection('paymentmethod').findOne({
                _id : new ObjectId(id),
            });
            return getDetailPaymentMethod;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
}
