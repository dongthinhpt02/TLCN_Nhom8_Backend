import { IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CartItemDTO {
    @IsString()
    @IsOptional()
    _id : ObjectId

    @IsString()
    @IsOptional()
    cartId : ObjectId

    @IsString()
    @IsOptional()
    productItemId : ObjectId

    @IsString()
    @IsOptional()
    productItemName : string

    @IsNumber()
    @IsOptional()
    price : number

    @IsNumber()
    @IsOptional()
    quantity : number

    @IsString()
    @IsOptional()
    imgProductItem : string

    @IsString()
    @IsOptional()
    totalPriceCartItem : number
}