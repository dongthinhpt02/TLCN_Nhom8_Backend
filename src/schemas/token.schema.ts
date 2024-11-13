import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Token{
    @Prop({require : true, unique : true})
    tokenId : string

    @Prop({require : false})
    refreshToken : string

    @Prop({required : false})
    expired : Date

}
export const TokenSchema = SchemaFactory.createForClass(Token); 