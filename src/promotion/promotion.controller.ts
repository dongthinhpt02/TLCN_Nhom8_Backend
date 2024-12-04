import { Controller, Post, UsePipes, ValidationPipe, Headers, Body, Param, Get } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDTO } from 'src/DTOs/CreatePromotion.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('promotion')
export class PromotionController {

    constructor(private readonly promotionService : PromotionService){}
    @Post('create')
    @UsePipes(new ValidationPipe())
    async createPromotion(@Headers('Authorization') authorization: string,
        @Body() createPromotionDTO: CreatePromotionDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newPromotion = {
            ...createPromotionDTO,
        };
        return this.promotionService.createPromotion(newPromotion);
    }

    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateNews(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updatePromotionDTO: CreatePromotionDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updatePromo = {
            ...updatePromotionDTO,
            _id: new ObjectId(id),
        }
        return this.promotionService.updatePromotion(updatePromo);
    }
    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockPromotion(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.promotionService.lockPromotin(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restorePromotion(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.promotionService.restorePromotion(id);
    }
    @Get('allpromotion')
    @UsePipes(new ValidationPipe())
    async getAllSize(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.promotionService.getAllPromotion();
    }
    @Get('allactivepromotion')
    @UsePipes(new ValidationPipe())
    async getAllActiveNews(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.promotionService.getAllActivePromotion();
    }
    @Get('detail/:id')
    @UsePipes(new ValidationPipe())
    async getDetailPromotion(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.promotionService.getDetailPromotion(id);
    }
}
