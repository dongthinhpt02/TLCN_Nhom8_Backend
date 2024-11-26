import { ObjectId } from 'mongodb';
class Cart {
    _id: ObjectId;
    user_id : ObjectId;
    totalQuantity: number;
    totalPriceCart: number;
  }
  
 