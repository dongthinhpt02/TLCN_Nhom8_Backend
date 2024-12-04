import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCartItemDTO } from 'src/DTOs/CreateCartItem.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class CartitemService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createCartItem(createCartItemDTO: CreateCartItemDTO) {
        try {
            const db = this.databaseService.getDb();
            const existingCartItem = await db.collection('cartitem').findOne({
                cartId: new ObjectId(createCartItemDTO.cartId),
                productItemId: new ObjectId(createCartItemDTO.productItemId),
            });

            if (existingCartItem) {
                // Nếu tồn tại, cập nhật số lượng và tổng giá
                const newQuantity = existingCartItem.quantity + createCartItemDTO.quantity;
                const newTotalPriceCartItem = newQuantity * createCartItemDTO.price;

                await db.collection('cartitem').updateOne(
                    { _id: existingCartItem._id },
                    {
                        $set: {
                            quantity: newQuantity,
                            totalPriceCartItem: newTotalPriceCartItem,
                        },
                    },
                );

                return {
                    message: 'Cart item updated successfully',
                    cartItemId: existingCartItem._id,
                    quantity: newQuantity,
                    totalPriceCartItem: newTotalPriceCartItem,
                };
            }
            // Nếu không tồn tại, thêm mới vào cartItem
            const totalPriceCartItem = createCartItemDTO.price * createCartItemDTO.quantity;

            const result = await db.collection('cartitem').insertOne({
                ...createCartItemDTO,
                cartId: new ObjectId(createCartItemDTO.cartId),
                productItemId: new ObjectId(createCartItemDTO.productItemId),
                totalPriceCartItem,
            });

            return {
                message: 'Cart item created successfully',
                cartItemId: result.insertedId,
                quantity: createCartItemDTO.quantity,
                totalPriceCartItem,
            };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async updateCartItem(updateCartItemDTO: CreateCartItemDTO) {
        try {
            const db = this.databaseService.getDb();
            const updateCartItem = {
                ...updateCartItemDTO,
            }
            console.log(updateCartItem);
            await db.collection('category').updateOne({ _id: new ObjectId(updateCartItemDTO._id) }, { $set: updateCartItem });

            return updateCartItem;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }

}
