import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Gender } from "src/enum/enum.gender.user";
import { Role } from "src/enum/enum.role.user";
import { Status } from "src/enum/enum.status.user";

export class CreateTokenDTO {
    @IsString()
    @IsOptional()
    tokenId: string;

    @IsString()
    @IsOptional()
    refreshToken: string;

    @IsDate()
    @IsOptional()
    expired: Date;
}

export class CreateCartDTO {
    @IsString()
    @IsOptional()
    cartId: string;

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
    userId: string;

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
}