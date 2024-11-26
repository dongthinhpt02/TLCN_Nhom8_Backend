import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class Address {
  _id: ObjectId;
  user_id : ObjectId;
  address : string;
  status : Status;
  createdAt? : Date = new Date()
  updatedAt? : Date;
  deletedAt? : Date;
}