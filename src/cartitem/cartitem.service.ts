import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CartItem, CreateCartItemDTO } from 'src/DTOs/CreateCartItem.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';
import { CartsService } from 'src/carts/carts.service';

@Injectable()
export class CartitemService {
    constructor(private readonly databaseService: DatabaseService,
        private readonly cartsService : CartsService
    ) { }

    async createCartItem(cartItem: CartItem) {
        try {
            const db = this.databaseService.getDb();
            const existingCartItem = await db.collection('cartitem').findOne({
                cartId: new ObjectId(cartItem.cartId),
                productItemId: new ObjectId(cartItem.productItemId),
            });
            console.log(existingCartItem)

            if (existingCartItem) {
                // Nếu tồn tại, cập nhật số lượng và tổng giá
                const newQuantity = existingCartItem.quantity + cartItem.quantity;
                const newTotalPriceCartItem = newQuantity * existingCartItem.price;

                await db.collection('cartitem').updateOne(
                    { _id: existingCartItem._id },
                    {
                        $set: {
                            quantity: newQuantity,
                            totalPriceCartItem: newTotalPriceCartItem,

                        },
                    },
                );
                // const cartItems = await db.collection('cartitem').find({ cartId: new ObjectId(cartItem.cartId) }).toArray();

                // // Dùng reduce để tính tổng số lượng (quantity)
                // const totalQuantity = cartItems.reduce((acc, cartItem) => acc + (cartItem.quantity || 0), 0);

                // // Cập nhật tổng số lượng vào trường totalQuantity của Cart
                // await db.collection('cart').updateOne(
                //     { _id: new ObjectId(cartItem.cartId) }, // Tìm Cart theo cartId
                //     { $set: { totalQuantity } },  // Cập nhật totalQuantity
                // );
                this.cartsService.updateTotalPriceAndQuantityInCart(cartItem.cartId)

                return {
                    message: 'Cart item updated successfully',
                    cartItemId: existingCartItem._id,
                    quantity: newQuantity,
                    totalPriceCartItem: newTotalPriceCartItem,
                };
            }
            // Nếu không tồn tại, thêm mới vào cartItem
            const findProductItem = await db.collection('productitem').findOne({
                _id : new ObjectId(cartItem.productItemId)
            })

            console.log(findProductItem)
            const totalPriceCartItem = findProductItem.price * cartItem.quantity;

            const result = await db.collection('cartitem').insertOne({
                cartId: new ObjectId(cartItem.cartId),
                productItemId: new ObjectId(cartItem.productItemId),
                sessionId: null,
                productItemName : findProductItem.productItemName,
                price : findProductItem.price,
                quantity : cartItem.quantity,
                imgProductItem : findProductItem.imgProductItem,
                totalPriceCartItem,
            });

            this.cartsService.updateTotalPriceAndQuantityInCart(cartItem.cartId)
            // const cartItems = await db.collection('cartitem').find({ cartId: new ObjectId(cartItem.cartId) }).toArray();

            // const totalQuantity = cartItems.reduce((acc, cartItem) => acc + (cartItem.quantity || 0), 0);

            // await db.collection('cart').updateOne(
            //     { _id: new ObjectId(cartItem.cartId) }, 
            //     { $set: { totalQuantity } },  
            // );
            return {
                message: 'Cart item created successfully',
                cartItemId: result.insertedId,
                quantity: cartItem.quantity,
                totalPriceCartItem,
            };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async updateCartItem(updateCartItemDTO: CreateCartItemDTO) {
        try {
            const db = this.databaseService.getDb();

            const totalPriceCartItem = (updateCartItemDTO.price || 0) * (updateCartItemDTO.quantity || 0);


            //Phải gửi đủ cartId, price, quantity
            const updateCartItem = {
                ...updateCartItemDTO,
                cartId : new ObjectId(updateCartItemDTO.cartId),
                totalPriceCartItem,
            }
            console.log(updateCartItem);
            await db.collection('cartitem').updateOne({ _id: new ObjectId(updateCartItemDTO._id) }, { $set: updateCartItem });
            console.log(updateCartItem.cartId)
            this.cartsService.updateTotalPriceAndQuantityInCart(updateCartItem.cartId)

            return updateCartItem;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async deleteCartItem(id : string){
        try {
            const db = this.databaseService.getDb();
            const find = await db.collection('cartitem').findOne({_id : new ObjectId(id)})
            await db.collection('cartitem').deleteOne({_id : new ObjectId(id)})
            this.cartsService.updateTotalPriceAndQuantityInCart(find.cartId);
            return { message: 'CartItem deleted successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
}
