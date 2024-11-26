import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class Product {
  _id: ObjectId;
  brand_id : ObjectId;
  cate_id : ObjectId;
  productName : string;
  imgProduct : string;
  status : Status;
  createdAt?: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
}
