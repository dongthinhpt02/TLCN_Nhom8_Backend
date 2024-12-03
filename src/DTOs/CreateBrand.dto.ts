import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { Status } from "src/enum/enum.status.user";

export class CreateBrandDTO{
    @IsString()
    @IsOptional()
    _id: ObjectId;

    @IsString()
    @IsOptional()
    brandName: string;

    @IsString()
    @IsOptional()
    imgBrand: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    description : string;

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