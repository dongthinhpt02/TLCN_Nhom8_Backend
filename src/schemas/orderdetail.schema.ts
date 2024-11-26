import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class OrderDetail {
  _id: ObjectId;
  cartItem_id : ObjectId;
  productItem_id : ObjectId;    
  productItemName : string;
  quantity : number;
  price : number;
  totalPriceOrderDetail : number;
  createdAt?: Date = new Date();
}
