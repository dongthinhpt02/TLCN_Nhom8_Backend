import { Controller, Post, UsePipes, ValidationPipe, Headers, Body, Param, Get } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDTO } from 'src/DTOs/CreateSize.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('size')
export class SizeController {
    constructor(private readonly sizeService: SizeService) {
    }
    @Post('create')
    @UsePipes(new ValidationPipe())
    async createSize(@Headers('Authorization') authorization: string,
        @Body() createSizeDTO: CreateSizeDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newSize = {
            ...createSizeDTO,
        };
        return this.sizeService.createSize(newSize);
    }
    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateSize(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updateSizeDTO: CreateSizeDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updateSize = {
            ...updateSizeDTO,
            _id: new ObjectId(id),
        }
        return this.sizeService.updateSize(updateSize);
    }
    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockSize(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.sizeService.lockSize(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restoreSize(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.sizeService.restoreSize(id);
    }
    @Get('allsize')
    @UsePipes(new ValidationPipe())
    async getAllSize(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.sizeService.getAllSize();
    }
    @Get('allactivesize')
    @UsePipes(new ValidationPipe())
    async getAllActiveSize(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.sizeService.getAllActiveSize();
    }
}
