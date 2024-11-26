import { ObjectId} from 'mongodb';
class LockingProductItem {
  _id: ObjectId;
  productItem_id : ObjectId;
  orderDetail_id : ObjectId;
  quantity : number;
  expiredAt : Date;
}

