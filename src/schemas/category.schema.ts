import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class Category {
  _id: ObjectId;
  cateName : string;
  imgCate : string;
  status : Status;
  createdAt?: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
}
