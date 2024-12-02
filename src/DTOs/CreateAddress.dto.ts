import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import {ObjectId} from 'mongodb'
import { Status } from "src/enum/enum.status.user";

export class CreateAddressDTO {
    @IsString()
    @IsOptional()
    _id: ObjectId;

    @IsString()
    @IsOptional()
    user_id: ObjectId;

    @IsString()
    @IsOptional()
    address: string;

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