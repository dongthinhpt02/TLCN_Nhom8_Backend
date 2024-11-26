import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class Color {
  _id: ObjectId;
  colorName : string;
  status : Status;
  createdAt?: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
}