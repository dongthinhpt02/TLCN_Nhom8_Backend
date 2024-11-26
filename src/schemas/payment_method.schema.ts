import { ObjectId} from 'mongodb';
import { Status } from 'src/enum/enum.status.user';

class PaymentMethod {
  _id: ObjectId;
  paymentMethodName : string;
}
