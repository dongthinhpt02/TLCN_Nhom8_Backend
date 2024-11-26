import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class Brand {
  _id: ObjectId;
  brandName : string;
  imgBrand : string;
  country : string;
  description : string;
  status : Status;
  createdAt?: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
}
