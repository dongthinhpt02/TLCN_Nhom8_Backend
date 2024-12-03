import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { ObjectId } from "mongodb";
import { Status } from "src/enum/enum.status.user";

export class CreatePromotionDTO{
    @IsString()
    @IsOptional()
    _id : ObjectId

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1)
    discount : number

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