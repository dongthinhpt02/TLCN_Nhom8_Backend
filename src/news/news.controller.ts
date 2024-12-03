import { Controller, Post, UsePipes, ValidationPipe, Headers, Body, Param, Get } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDTO } from 'src/DTOs/CreateNews.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('news')
export class NewsController {

    constructor(private readonly newsService : NewsService){}
    @Post('create')
    @UsePipes(new ValidationPipe())
    async createNews(@Headers('Authorization') authorization: string,
        @Body() createNewsDTO: CreateNewsDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newNews = {
            ...createNewsDTO,
        };
        return this.newsService.createNews(newNews);
    }

    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updateNews(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updateNewsDTO: CreateNewsDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updateNews = {
            ...updateNewsDTO,
            _id: new ObjectId(id),
        }
        return this.newsService.updateNews(updateNews);
    }
    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockNews(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.newsService.lockNews(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restoreNews(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.newsService.restoreNews(id);
    }
    @Get('allnews')
    @UsePipes(new ValidationPipe())
    async getAllSize(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.newsService.getAllNews();
    }
    @Get('allactivenews')
    @UsePipes(new ValidationPipe())
    async getAllActiveNews(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.newsService.getAllActiveNews();
    }
}
