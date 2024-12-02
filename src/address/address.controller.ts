import { Body, Controller, Post, UsePipes, ValidationPipe, Headers, UnauthorizedException, Param, Head, Get, Query } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateAddressDTO } from 'src/DTOs/CreateAddress.dto';
import { ObjectId } from 'mongodb';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService,
        private readonly authService: AuthService
    ) { }

    @Post('create')
    @UsePipes(new ValidationPipe())
    async createAddress(@Headers('Authorization') authorization: string,
        @Body() createAddressDTO: CreateAddressDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const token = authorization.split(' ')[1];
        const user_id = await this.authService.getUserIdFromAccessToken(token);
        const newAddress = {
            ...createAddressDTO,
            user_id: new ObjectId(user_id),
        };
        return this.addressService.createAddress(newAddress);
    }
    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateAddress(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() createAddressDTO: CreateAddressDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        // const token = authorization.split(' ')[1];
        // const decoded = await this.authService.getUserIdFromAccessToken(token);  // Phương thức verify token của bạn
        // const user_id = decoded;
        const updateAddress = {
            ...createAddressDTO,
            // user_id: new ObjectId(user_id),
            _id: new ObjectId(id),
            updatedAt: new Date(),
        }
        return this.addressService.updateAddress(updateAddress);
    }

    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockAddress(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.addressService.lockAddress(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restoreAddress(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.addressService.restoreAddress(id);
    }
    @Get('alladdress')
    @UsePipes(new ValidationPipe())
    async getAllAddress(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.addressService.getAllAddress();
    }

    @Get('search')
    @UsePipes(new ValidationPipe())
    async searchAddress(@Headers('Authorization') authorization: string,
        @Query('keyword') keyword: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        if (!keyword) {
            throw new CustomException('Keyword is required');
        }
        return this.addressService.getAddressByKeyword(keyword);
    }
}
