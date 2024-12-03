import { Controller, Post, UsePipes, ValidationPipe, Headers, Body, Param, Get } from '@nestjs/common';
import { CreateColorDTO } from 'src/DTOs/CreateColor.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';
import { ColorService } from './color.service';

@Controller('color')
export class ColorController {
    constructor(private readonly colorService: ColorService) {
    }
    @Post('create')
    @UsePipes(new ValidationPipe())
    async createColor(@Headers('Authorization') authorization: string,
        @Body() createColorDTO: CreateColorDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newColor = {
            ...createColorDTO,
        };
        return this.colorService.createColor(newColor);
    }
    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateColor(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updateColorDTO: CreateColorDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updateColor = {
            ...updateColorDTO,
            _id: new ObjectId(id),
        }
        return this.colorService.updateColor(updateColor);
    }
    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockColor(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.colorService.lockColor(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restoreColor(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.colorService.restoreColor(id);
    }
    @Get('allcolor')
    @UsePipes(new ValidationPipe())
    async getAllColor(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.colorService.getAllColor();
    }
    @Get('allactivecolor')
    @UsePipes(new ValidationPipe())
    async getAllActiveColor(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.colorService.getAllActiveColor();
    }
}
