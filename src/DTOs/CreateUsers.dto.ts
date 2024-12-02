import { Transform, Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Gender } from "src/enum/enum.gender.user";
import { Role } from "src/enum/enum.role.user";
import { Status } from "src/enum/enum.status.user";
import {ObjectId} from 'mongodb'

export class CreateTokenDTO {
    @IsString()
    @IsOptional()
    _id: ObjectId;

    @IsString()
    @IsOptional()
    user_id : ObjectId;

    @IsString()
    @IsOptional()
    refreshToken: string;

    @Type(() => Date) 
    @Transform(() => new Date(), { toClassOnly: true })
    @IsDate()
    @IsOptional()
    createdAt?: Date = new Date();
    
}

export class CreateCartDTO {
    @IsString()
    @IsOptional()
    _id: ObjectId;

    @IsString()
    @IsOptional()
    user_id : ObjectId;

    @IsNumber()
    @IsOptional()
    totalQuantity: number;

    @IsNumber()
    @IsOptional()
    totalPriceCart: number;
}

export class CreateUserDTO {
    @IsOptional()
    @IsString()
    _id: ObjectId;

    @IsString()
    fullname: string;

    @IsString()
    avatar: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;

    @Type(() => Date)
    @IsDate()
    dateOfBirth: Date;

    @IsString()
    phoneNumber : String

    @Type(() => Number)
    @IsEnum(Status)
    @IsOptional()
    status: Status;

    @IsOptional()
    @ValidateNested()
    token: CreateTokenDTO;

    @IsOptional()
    @ValidateNested()
    cart: CreateCartDTO;

    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    updatedAt?: Date;

    @Type(() => Date) 
    @IsDate()
    @IsOptional()
    deletedAt?: Date;
}