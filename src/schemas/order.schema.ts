import { ObjectId} from 'mongodb';
import { StatusOrder } from 'src/enum/enum.order.user';
import { Status } from 'src/enum/enum.status.user';

class Order {
  _id: ObjectId;
  address_id : ObjectId;
  payment_method_id : ObjectId;
  cart_id : ObjectId;
  promotion_id : ObjectId;
  totalPriceOrder : number;
  createdAt?: Date = new Date();
  status : StatusOrder;
}
