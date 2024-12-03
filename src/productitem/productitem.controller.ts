import { Controller, Post, UsePipes, ValidationPipe, Headers, Body, Param, Get, Query } from '@nestjs/common';
import { ProductitemService } from './productitem.service';
import { CreateProductItemDTO } from 'src/DTOs/CreateProductItem.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('productitem')
export class ProductitemController {
    constructor(private readonly productItemService : ProductitemService){}

    @Post('create')
    @UsePipes(new ValidationPipe())
    async createProduct(@Headers('Authorization') authorization: string,
        @Body() createProductItemDTO: CreateProductItemDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newProductItem = {
            ...createProductItemDTO,
            productId : new ObjectId(createProductItemDTO.productId),
            colorId : new ObjectId(createProductItemDTO.colorId),
            sizeId : new ObjectId(createProductItemDTO.sizeId)
        };
        return this.productItemService.createProductItem(newProductItem);
    }

    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateProductItem(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updateProductItemDTO: CreateProductItemDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updateProductItem = {
            ...updateProductItemDTO,
            _id: new ObjectId(id),
        }
        return this.productItemService.updateProductItem(updateProductItem);
    }

    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockProductItem(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productItemService.lockProductItem(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restoreProductItem(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productItemService.restoreProductItem(id);
    }
    @Get('allproductitem')
    @UsePipes(new ValidationPipe())
    async getAllProductItem(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productItemService.getAllProductItem();
    }
    @Get('allactiveproductitem')
    @UsePipes(new ValidationPipe())
    async getAllActiveProductItem(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productItemService.getAllActiveProductItem();
    }
    @Get('search')
    @UsePipes(new ValidationPipe())
    async searchProductItem(@Headers('Authorization') authorization: string,
        @Query('keyword') keyword: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        if (!keyword) {
            throw new CustomException('Keyword is required');
        }
        return this.productItemService.searchProductItem(keyword);
    }
}
