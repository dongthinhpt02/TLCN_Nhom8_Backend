import { Body, Controller, Get, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/DTOs/CreateUsers.Dto';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
    constructor(private userService : UsersService){}
    @Post()
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto : CreateUserDTO){
    }
}
