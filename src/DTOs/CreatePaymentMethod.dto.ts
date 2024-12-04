import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { Status } from "src/enum/enum.status.user";

export class CreatePaymentMethodDTO{
    @IsString()
    @IsOptional()
    _id : ObjectId

    @IsString()
    @IsOptional()
    paymentMethodName : string

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
    udpatedAt?: Date;

    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    deletedAt?: Date;
}