import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ObjectId } from "mongodb";
import { Status } from "src/enum/enum.status.user";

export class CreateProductItemDTO{
    @IsString()
    @IsOptional()
    _id : ObjectId

    @IsString()
    @IsOptional()
    productId : ObjectId

    @IsString()
    @IsOptional()
    colorId : ObjectId

    @IsString()
    @IsOptional()
    sizeId : ObjectId

    @IsString()
    @IsOptional()
    productItemName : string

    @IsNumber()
    @IsOptional()
    price : number

    @IsString()
    @IsOptional()
    imgProductItem : string

    @IsInt()
    @IsOptional()
    @Min(0)
    quantity : number

    @IsString()
    @IsOptional()
    description : string

    @Type(() => Number)
    @IsEnum(Status)
    @IsOptional()
    status: Status;

    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    createdAt: Date;

    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    updatedAt?: Date;

    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    deletedAt?: Date;
}