import { Controller, Post, Headers, UsePipes, ValidationPipe, Body, Param, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from 'src/DTOs/CreateProduct.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('product')
export class ProductController {
    constructor(private readonly productService : ProductService){}
    @Post('create')
    @UsePipes(new ValidationPipe())
    async createProduct(@Headers('Authorization') authorization: string,
        @Body() createProductDTO: CreateProductDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newProduct = {
            ...createProductDTO,
            brandId : new ObjectId(createProductDTO.brandId),
            cateId : new ObjectId(createProductDTO.cateId)
        };
        return this.productService.createProduct(newProduct);
    }
    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateProduct(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updateProductDTO: CreateProductDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updateProduct = {
            ...updateProductDTO,
            _id: new ObjectId(id),
        }
        return this.productService.updateProduct(updateProduct);
    }
    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockProduct(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productService.lockProduct(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restoreProduct(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productService.restoreProduct(id);
    }
    @Get('allproduct')
    @UsePipes(new ValidationPipe())
    async getAllProduct(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productService.getAllProduct();
    }
    @Get('allactiveproduct')
    @UsePipes(new ValidationPipe())
    async getAllActiveProduct(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productService.getAllActiveProduct();
    }
    @Get('search')
    @UsePipes(new ValidationPipe())
    async searchProduct(@Headers('Authorization') authorization: string,
        @Query('keyword') keyword: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        if (!keyword) {
            throw new CustomException('Keyword is required');
        }
        return this.productService.searchProduct(keyword);
    }
    @Get('detail/:id')
    @UsePipes(new ValidationPipe())
    async getDetailProduct(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.productService.getDetailProduct(id);
    }
}
