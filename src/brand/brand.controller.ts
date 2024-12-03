import { Controller, Post, UsePipes, ValidationPipe, Headers, Body, Param, Get, Query } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateBrandDTO } from 'src/DTOs/CreateBrand.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb'
import { BrandService } from './brand.service';

@Controller('brand')
export class BrandController {
    constructor(private readonly databaseService: DatabaseService,
        private readonly brandService: BrandService,
        private readonly authService: AuthService
    ) {

    }

    @Post('create')
    @UsePipes(new ValidationPipe())
    async createBrand(@Headers('Authorization') authorization: string,
        @Body() createBrandDTO: CreateBrandDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newBrand = {
            ...createBrandDTO,
        };
        return this.brandService.createBrand(newBrand);
    }

    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateBrand(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updateBrandDTO: CreateBrandDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updateBrand = {
            ...updateBrandDTO,
            _id: new ObjectId(id),
            updatedAt: new Date(),
        }
        return this.brandService.updateBrand(updateBrand);
    }
    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockAddress(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.brandService.lockBrand(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restoreAddress(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.brandService.restoreBrand(id);
    }
    @Get('allbrand')
    @UsePipes(new ValidationPipe())
    async getAllBrand(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.brandService.getAllBrand();
    }

    @Get('allactivebrand')
    @UsePipes(new ValidationPipe())
    async getAllActiveBrand(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.brandService.getAllActiveBrand();
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
        return this.brandService.searchBrand(keyword);
    }
}
