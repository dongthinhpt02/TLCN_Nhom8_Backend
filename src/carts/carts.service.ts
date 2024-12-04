import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ObjectId } from 'mongodb';
import { CustomException } from 'src/exception/CustomException';

@Injectable()
export class CartsService {
    constructor(private readonly databaseService : DatabaseService){}

    async updateTotalPriceAndQuantityInCart(cartId: ObjectId): Promise<void> {
        try {
          const db = this.databaseService.getDb();

          const cartItems = await db.collection('cartitem').find({ cartId: new ObjectId(cartId) }).toArray();
    
          const { totalQuantity, totalPriceCart } = cartItems.reduce(
            (acc, cartItem) => {

              acc.totalQuantity += cartItem.quantity || 0;
    
              acc.totalPriceCart += (cartItem.price || 0) * (cartItem.quantity || 0);
    
              return acc;
            },
            { totalQuantity: 0, totalPriceCart: 0 },
          );
    
          await db.collection('carts').updateOne(
            { _id: new ObjectId(cartId) },
            { 
              $set: {
                totalQuantity,   
                totalPriceCart, 
              },
            },
          );
        } catch (error) {
          throw new CustomException(`Error while updating total price and quantity in cart: ${error.message}`);
        }
      } 
}
