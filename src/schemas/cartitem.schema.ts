import { ObjectId} from 'mongodb';
class CartItem {
  _id: ObjectId;
  cart_id : ObjectId;
  productItem_id : ObjectId;
  productItemName : string;
  quantity : number;
  price : number;
  imgProductItem : string;
  totalPriceCartItem : number;
}

