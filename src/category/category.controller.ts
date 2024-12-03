import { Controller, Post, UsePipes, ValidationPipe, Headers, Body, Param, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from 'src/DTOs/CreateCategory.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('cate')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {

    }
    @Post('create')
    @UsePipes(new ValidationPipe())
    async createCategory(@Headers('Authorization') authorization: string,
        @Body() createCategoryDTO: CreateCategoryDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newCate = {
            ...createCategoryDTO,
        };
        return this.categoryService.createCategory(newCate);
    }
    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateCategory(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updateCategoryDTO: CreateCategoryDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updateCate = {
            ...updateCategoryDTO,
            _id: new ObjectId(id),
        }
        return this.categoryService.updateCategory(updateCate);
    }
    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockCate(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.categoryService.lockCategory(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restoreCate(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.categoryService.restoreCategory(id);
    }
    @Get('allcate')
    @UsePipes(new ValidationPipe())
    async getAllCate(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.categoryService.getAllCate();
    }
    @Get('allactivecate')
    @UsePipes(new ValidationPipe())
    async getAllActiveCate(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.categoryService.getAllActiveCate();
    }
    @Get('search')
    @UsePipes(new ValidationPipe())
    async searchBrand(@Headers('Authorization') authorization: string,
        @Query('keyword') keyword: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        if (!keyword) {
            throw new CustomException('Keyword is required');
        }
        return this.categoryService.searchCate(keyword);
    }
}
