import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import internal from "stream";

@Schema()
export class Cart{
    @Prop({require : true, unique : true})
    cartId : string
    
    @Prop({require : true})
    totalQuantity : number

    @Prop({require : true})
    totalPriceCart : number
}
export const CartSchema = SchemaFactory.createForClass(Cart);