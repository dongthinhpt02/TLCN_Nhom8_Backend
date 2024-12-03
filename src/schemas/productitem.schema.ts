import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class ProductItem {
  _id: ObjectId;
  product_id : ObjectId;
  size_id : ObjectId;
  color_id : ObjectId;
  productItemName : string;
  price : number;
  quantity : number;
  description : string;
  imgProductItem : string;
  status : Status;
  createdAt?: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
}
