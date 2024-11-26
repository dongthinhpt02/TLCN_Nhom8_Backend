import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class Size {
  _id: ObjectId;
  sizeName : string;
  status : Status;
  createdAt?: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
}
