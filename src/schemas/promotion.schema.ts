import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class Promotion {
  _id: ObjectId;
  discount : number;
  startDate : Date;
  endDate : Date;
  status : Status;
  createdAt?: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
}
