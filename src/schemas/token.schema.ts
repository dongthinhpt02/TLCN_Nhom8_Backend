import { Transform } from 'class-transformer';
import { ObjectId} from 'mongodb';

class Token {
  _id: ObjectId;
  user_id : ObjectId;
  refreshToken: string;
  createdAt?: Date = new Date();
}
