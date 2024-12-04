import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, Min } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateLockingProductItemDTO {
    @IsString()
    @IsOptional()
    _id : ObjectId

    @IsString()
    @IsOptional()
    productItemId : ObjectId

    @IsString()
    @IsOptional()
    userId : ObjectId

    @IsString()
    @IsOptional()
    orderDetailId : ObjectId

    @IsInt()
    @IsOptional()
    @Min(1)
    quantity : number

    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    expiredAt: Date;
    
}